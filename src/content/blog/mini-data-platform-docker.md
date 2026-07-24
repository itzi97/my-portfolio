---
title: "A Mini Data Platform in Docker Compose"
description: "Standing up Spark, HDFS, PostgreSQL, and MongoDB in containers for a Data Processing course project — and why most of the work was plumbing, not code."
pubDate: 2026-07-24
tags: ["Data Engineering", "Spark", "Docker"]
kind: note
---

For the Data Processing course at U-tad, the assignment was to build a small but complete distributed data environment and run real ETL through it: flight-network data — countries, airlines, airports, routes — ingested with Spark, landed in both PostgreSQL and MongoDB, then analysed in a final Spark job.

The environment is a single `docker-compose.yml` with six containers:

- A **Spark Standalone cluster** — one master, two workers, each with 4 cores and 8 GB
- **HDFS**, built from a custom image (the official Hadoop images don't hand you a working single-node HDFS for free)
- **PostgreSQL**, written to over JDBC
- **MongoDB**, written to through the Spark connector

The ETL itself is four Scala jobs, one per dataset, plus an analysis job on top. [Code and report are in the repo](https://github.com/itzi97/DP_practice).

## What the plumbing taught me

**Most of "distributed data processing" is configuration.** The Scala that transforms a CSV is the easy part; the hours go into making five services agree with each other — hostnames, ports, volume mounts, and connector jars that must match your exact Spark and Scala versions. The image tag says it all: `spark:3.5.8-scala2.12-java11`. Every jar in the extra-jars mount has to respect that triplet, and nothing tells you loudly when one doesn't.

**Build the environment incrementally.** The compose file grew step by step — databases first, then HDFS, then the Spark cluster, then the extra WebUI ports — and each step got verified before the next went in. Debugging one new container at a time is annoying; debugging six at once is impossible.

**The web UIs are not optional.** Spark's master UI (8080), the per-application UI (4040), and HDFS's NameNode UI (9870) turned "why is this job stuck" from guesswork into reading. Exposing them was a late addition to the compose file that should have been a first-line decision.

## What the data taught me

The analysis produced real numbers — 1,304 routes departing Brazil, the US leading with 234 airports above 2,000 ft, an average of 127 routes per airline — but the interesting lessons were the three bugs on the way there.

**"Local" means nothing on a cluster.** My first `saveAsTable` ran clean but produced empty tables. `DESCRIBE FORMATTED` revealed why: without an explicit path, Spark wrote to `spark.sql.warehouse.dir` — a *local filesystem* path, meaning local to whichever worker did the write, invisible to every other container. Explicit HDFS paths on every write fixed it.

**One duplicate row, one off-by-one.** I ran every query twice — once through the DataFrame API, once as SQL against the same tables — as a sanity check. One query disagreed with itself: 208 rows vs 207. The cause was a genuine duplicate in the source data (India appears twice in `countries.txt` with different DAFIF codes), surfaced only because my `.distinct()` sat before the join in one version and after it in the other. Accidental self-verification; I recommend it on purpose.

**Wrong field, silent zero.** The final aggregation filtered airports by timezone `'O'` — which isn't a UTC offset at all, it's OpenFlights' single-letter DST region code for Australia. Filtering the numeric timezone column instead didn't error; it just returned zero rows all the way down the pipeline. (Australia duly leads the corrected result, with 58 qualifying airports.)

The same pattern — spreadsheets and scattered sources in, one queryable system out — is what I spend my days on at work, at a very different scale. The container versions change; the lesson doesn't: the data is only as good as the plumbing that carries it.
