---
title: "Building a Lightweight ODM in Python: When You Don't Need Mongoose"
description: "How I built a custom Object-Document Mapper for MongoDB and Redis in Python — the design decisions, the tradeoffs, and what I'd do differently."
pubDate: 2026-06-02
tags: ["Python", "MongoDB", "Redis", "Backend"]
---

Most tutorials reach for [Mongoengine](https://mongoengine.org/) or [Beanie](https://roman-right.github.io/beanie/) the moment MongoDB enters the picture. For a university project simulating a social media backend, I decided to build a small ODM from scratch instead. This is what I learned.

## The problem

The project required storing users, posts, and relationships across both MongoDB (documents) and Redis (caching and session data). The obvious move was to grab an existing ODM and a Redis client and wire them together. But I wanted to understand what an ODM actually *does* under the hood — and a university project is exactly the right place to make that trade.

The core job of an ODM is simple: map between Python objects and the raw dictionaries a database driver gives you. The interesting part is everything that surrounds that mapping — validation, serialisation, relationships, and knowing when *not* to hit the database.

## The design

I settled on three layers:

**1. A base `Document` class** that every model inherits from. It holds the collection name, handles `_id` ↔ `id` translation (MongoDB's `_id` is an `ObjectId`; Python code shouldn't have to care about that), and exposes `save()`, `delete()`, and `find()` classmethods that delegate to `pymongo`.

```python
class Document:
    _collection: str = ""

    def to_dict(self) -> dict:
        data = self.__dict__.copy()
        data.pop("_id", None)
        return data

    def save(self) -> None:
        col = db[self._collection]
        if hasattr(self, "_id") and self._id:
            col.replace_one({"_id": self._id}, self.to_dict())
        else:
            result = col.insert_one(self.to_dict())
            self._id = result.inserted_id

    @classmethod
    def find(cls, **kwargs):
        col = db[cls._collection]
        return [cls(**doc) for doc in col.find(kwargs)]
```

**2. A `CachedDocument` mixin** for models that benefit from Redis. The first `get()` call hits MongoDB and writes the result to Redis with a TTL. Subsequent calls within the TTL window skip the database entirely. Writes always invalidate the cache.

```python
class CachedDocument(Document):
    _ttl: int = 300  # seconds

    @classmethod
    def get(cls, id: str):
        key = f"{cls._collection}:{id}"
        cached = redis_client.get(key)
        if cached:
            return cls(**json.loads(cached))
        doc = cls.find(_id=ObjectId(id))
        if doc:
            redis_client.setex(key, cls._ttl, json.dumps(doc[0].to_dict()))
        return doc[0] if doc else None

    def save(self) -> None:
        super().save()
        key = f"{self._collection}:{self._id}"
        redis_client.delete(key)  # invalidate on write
```

**3. Field descriptors** for basic validation. Rather than a full schema library, I used Python descriptors to enforce types at assignment time — enough for a project scope, but the first thing I'd swap out for Pydantic in production.

## What worked

The `CachedDocument` mixin turned out cleaner than expected. Because Python's MRO handles the method resolution, any model that needs caching just inherits from `CachedDocument` instead of `Document` — no changes to call sites. Session objects and user profiles got caching for free.

The `_id` ↔ `id` translation was worth doing early. Every layer above the ODM worked with plain string IDs; the `ObjectId` conversion was contained to `Document.save()` and `Document.find()`. This made testing significantly easier since you could construct documents with predictable string IDs.

## What I'd change

**Validation.** The hand-rolled descriptors were fine for five fields per model. They'd become a maintenance problem at scale. I'd use [Pydantic](https://docs.pydantic.dev/) models as the data layer and keep the ODM purely responsible for persistence.

**Async.** `pymongo`'s synchronous driver blocks the thread on every database call. For a real API this matters — [Motor](https://motor.readthedocs.io/) (the async MongoDB driver) and `redis.asyncio` would be the right swap, especially combined with FastAPI.

**No migrations.** MongoDB's schemaless nature means you can ship a new field and old documents just won't have it. That's convenient until it isn't. A lightweight migration log (even just a versioned script collection) would have saved time when the schema evolved mid-project.

## The takeaway

Building your own ODM for production is almost never the right call — Beanie with Pydantic v2 is excellent and well-maintained. But building one once, small, gives you a much clearer mental model of what any ODM is actually doing when you use it. The caching layer in particular is something I now think about explicitly every time I design a data access pattern.

The full source is on [GitHub](https://github.com/itzi97/AD-ODM).
