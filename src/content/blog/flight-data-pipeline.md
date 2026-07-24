---
title: "Spark, HDFS, and Two Databases: A Flight-Data Pipeline in Docker Compose"
description: "Building a containerised Spark cluster that ingests OpenFlights data into four different stores, unifies them as permanent SQL tables, and survives three instructive bugs."
pubDate: 2026-07-24
tags: ["Data Engineering", "Spark", "Docker"]
kind: post
---

For the Data Processing course at U-tad, the assignment was to build a small but complete distributed data environment and run real ETL through it: flight-network data — countries, airlines, airports, routes — ingested with Spark and landed, deliberately, in four *different* stores, then read back and analysed as one. [Code and report are in the repo](https://github.com/itzi97/DP_practice).

The whole pipeline, on one screen:

```text
 OpenFlights data        Spark ETL (Scala)            storage
 ────────────────        ─────────────────            ───────
 countries.txt ────▶  ┌─────────────────────┐  ────▶  HDFS (csv)
 airlines.dat  ────▶  │ Spark Standalone    │  ────▶  HDFS (parquet)
 airports.dat  ────▶  │ master + 2 workers  │  ────▶  PostgreSQL (JDBC)
 routes.dat    ────▶  └─────────────────────┘  ────▶  MongoDB (connector)
                                 │
                   analysis: read all four back
                                 ▼
                permanent Spark SQL tables on HDFS
         /practice/tables/* ─▶ 6 queries + 1 aggregation
```

## The environment

Six containers in a single `docker-compose.yml`: a Spark Standalone cluster (one master, two workers at 4 cores / 8 GB each), HDFS built from a custom image, PostgreSQL, and MongoDB. The compose file grew incrementally — databases first, then HDFS, then the cluster, each step verified before the next — because debugging one new container is annoying and debugging six at once is impossible.

The worker definition shows most of what matters:

```yaml
spark-worker-1:
  image: apache/spark:3.5.8-scala2.12-java11-python3-r-ubuntu
  command: /opt/spark/bin/spark-class org.apache.spark.deploy.worker.Worker spark://spark-master:7077
  environment:
    - SPARK_WORKER_CORES=4
    - SPARK_WORKER_MEMORY=8g
  volumes:
    - ./data:/data
    - ./jars:/opt/spark/jars/extra
    - ./spark-defaults.conf:/opt/spark/conf/spark-defaults.conf
```

That `jars` mount carries the JDBC driver and the MongoDB Spark connector — and every jar in it must agree with the image tag's `3.5.8-scala2.12-java11` triplet. Nothing tells you loudly when one doesn't. The web UIs (master on 8080, application on 4040, HDFS NameNode on 9870) turned "why is this job stuck" from guesswork into reading; exposing them should have been a first-line decision, not the late addition it was.

## Ingestion: four datasets, four stores

Each dataset gets its own Scala job and its own destination. The airports job also derives a column with a UDF — which hemisphere quadrant each airport sits in:

```scala
val quadrantUdf = udf((latitude: Double, longitude: Double) => {
  if (latitude >= 0 && longitude >= 0) "NE"
  else if (latitude >= 0 && longitude < 0) "NW"
  else if (latitude < 0 && longitude >= 0) "SE"
  else "SW"
})

val airportsWithQuadrant = airportsDf.withColumn(
  "hemisphere_quadrant",
  quadrantUdf(airportsDf("latitude"), airportsDf("longitude"))
)

airportsWithQuadrant.write
  .mode("overwrite")
  .jdbc("jdbc:postgresql://postgres:5432/sparkdb", "airports", pgProps)
```

## Analysis: one API over four sources

The payoff of scattering the data on purpose is this block — four completely different storage systems, one uniform read API:

```scala
val countriesDf = spark.read
  .option("header", "true")
  .csv("hdfs://hdfs:9000/practice/countries")

val airlinesDf = spark.read
  .parquet("hdfs://hdfs:9000/practice/airlines")

val airportsDf = spark.read
  .jdbc(pgUrl, "airports", "airport_id", 1, 14000, 4, pgProps)

val routesDf = spark.read
  .format("mongodb")
  .option("spark.mongodb.read.connection.uri", "mongodb://mongodb:27017/practice.routes")
  .load()
```

Each source then becomes a permanent Spark SQL table, and every query runs twice — once through the DataFrame API, once as SQL — with results compared. That double-running felt like busywork until it caught a real bug (below).

The analysis itself produced real numbers: 1,304 routes depart Brazil, the US leads with 234 airports above 2,000 ft, airlines average 127 routes each, and the final aggregation — airports with at least two routes to DST-region-`'O'` destinations, grouped by country — is led by Australia with 58, persisted to HDFS as Parquet and registered as a fifth permanent table.

## Three bugs worth keeping

### "Local" means nothing on a cluster

My first `saveAsTable` ran clean but produced empty tables. `DESCRIBE FORMATTED` revealed why: without an explicit path, Spark wrote to `spark.sql.warehouse.dir` — a *local filesystem* path, meaning local to whichever worker did the write, invisible to every other container. The fix is one option per write:

```scala
countriesDf.write
  .option("path", "hdfs://hdfs:9000/practice/tables/countries")
  .saveAsTable("countries")
```

### One duplicate row, one off-by-one

The only query where DataFrame API and SQL disagreed: 208 rows vs 207. The cause was a genuine duplicate in the source data — India appears twice in `countries.txt` with different DAFIF codes — surfaced only because my `.distinct()` sat before the join in one version and after it in the other:

```scala
val q6_df = spark.table("routes")
  .filter(col("codeshare").isNull || trim(col("codeshare")) === "")
  .select("source_country")
  .distinct()                                   // not enough: pre-join
  .join(spark.table("countries"), col("source_country") === col("name"))
  .select("source_country", "iso_code")
  .distinct()                                   // this one catches the dup
```

Accidental self-verification; I now recommend it on purpose.

### Wrong field, silent zero

OpenFlights' `airports.dat` has two fields that both smell like "timezone": a numeric UTC offset and a single-letter DST region code (`E/A/S/O/Z/N/U`). The task's "timezone `'O'`" only makes sense for the letter-coded field — `'O'` is the Australian DST region, not an offset. Filtering the numeric column instead didn't error; it just returned zero rows all the way down the pipeline. Silent zeros are worse than exceptions.

## What transfers

The same pattern — scattered sources in, one queryable system out — is what I spend my days on at work, at a very different scale. The container versions change; the lesson doesn't: the data is only as good as the plumbing that carries it, and the bugs that matter most are the ones that don't throw.
