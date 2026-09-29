# MongoDB

Learn the basics of [MongoDB][mongodb], one of the most populars
document-oriented databases.

**You will need**

- A Unix CLI
- A running MongoDB 8.0 server ([installation instructions][install])

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What is MongoDB?](#what-is-mongodb)
  - [Why MongoDB?](#why-mongodb)
  - [Document-oriented database](#document-oriented-database)
  - [Schema-less collections](#schema-less-collections)
  - [Embed or reference?](#embed-or-reference)
- [Query language](#query-language)
  - [Connecting](#connecting)
  - [Inserting documents](#inserting-documents)
  - [Inserting multiple documents](#inserting-multiple-documents)
  - [Finding documents](#finding-documents)
    - [Query operators](#query-operators)
    - [Projection](#projection)
    - [Sort, paginate and count](#sort-paginate-and-count)
  - [Updating documents](#updating-documents)
    - [Upserts](#upserts)
    - [Atomic operations](#atomic-operations)
  - [Replacing documents](#replacing-documents)
  - [Removing documents](#removing-documents)
- [Indexes](#indexes)
  - [Without an index](#without-an-index)
  - [With an index](#with-an-index)
  - [Compound indexes](#compound-indexes)
  - [Unique indexes](#unique-indexes)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is MongoDB?

<!-- slide-front-matter class: center, middle, image-header -->

<p class='center'><img src='images/mongodb.png' width='60%' /></p>

> "MongoDB is a source-available, cross-platform, **document-oriented database** program."

### Why MongoDB?

- **Documents are JSON-like**: what your API sends and receives is close to
  what you store
- **Flexible schema**: add a field without migrating the whole collection
- **Rich queries**: filters, sorting, text search, and the two your project
  needs, **geospatial queries** and **aggregations**
- **Scales out**: replication and sharding across many servers

### Document-oriented database

Instead of SQL rows, you store [**JSON-like**][bson] documents in MongoDB:

```js
{
  _id: ObjectId('54c955492b7c8eb21818bd09'),
  firstName: 'John',
  lastName: 'Doe',
  birthDate: ISODate('1970-10-01T00:00:00.000Z'),
  interests: [ 'Pastry', 'Kung fu' ],
  address: {
    city: 'Livingston',
    street: '13 Garden Street',
    zip: '07039'
  },
  phones: [
    { type: 'professional', number: '+1-202-555-0144' },
    { type: 'home', number: '+1-202-555-0186' }
  ]
}
```

- Documents are **key-value** data structures.
- Values may include other **documents, arrays, and arrays of documents**.
- Every document has a unique **`_id`** (its **primary key**), by default an
  **`ObjectId`**: 12 bytes, starting with a timestamp.

### Schema-less collections

Documents are stored in **collections**. Unlike SQL tables, collections are
**schema-less**. These two documents could be stored in the same collection:

```js
{
  _id: ObjectId('54c955492b7c8eb21818bd09'),
  name: 'John Doe',
  birthDate: ISODate('1970-10-01T00:00:00.000Z'),
  interests: [ 'Pastry', 'Kung fu' ]
}
```

```js
{
  _id: ObjectId('54c955492b7c8eb21818cd10'),
  model: 'Campagna T-Rex',
  wheels: 3,
  dimensions: { length: '3.5m', width: '1.981m', height: '1.067m' }
}
```

This example may not be a good idea, but it also means your documents can
**evolve** (add keys, remove others) without having to migrate your schema.

### Embed or reference?

<!-- slide-column -->

**Embed** (a sub-document)

```js
{ name: 'John Doe',
  address: { city: 'Livingston' } }
```

- Read together, **owned** by the parent
- Bounded size (not "all comments ever")

<!-- slide-column -->

**Reference** (store the `_id`)

```js
{ title: 'Casino Royale',
  director: ObjectId('…') }
```

- Has **its own lifecycle** and API resource
- Shared, or grows without limit

<!-- slide-container -->

Read more about [data modeling][data-modeling].

## Query language

<!-- slide-front-matter class: center, middle -->

Inserting, querying, updating and removing documents.

### Connecting

Connect to the MongoDB shell from your CLI and you should have a **new prompt**,
indicating that you can now type MongoDB commands and queries:

```bash
$> mongosh
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&...
Using MongoDB:		8.0.32
Using Mongosh:		2.12.0
...
test>
```

You can switch databases with `use <name>`:

```bash
test> use test
already on db test
test> use archioweb
switched to db archioweb
```

Note that you do not need to create the "archioweb" database before accessing
it. It is **automatically created** as you first access it.

### Inserting documents

Insert a couple of documents into a collection named **people** (again,
automatically created if it doesn't exist). MongoDB should acknowledge each
insertion by showing you the new `ObjectId` of the inserted object.

```js
db.people.insertOne({
  name: 'John Doe',
  email: 'john.doe@example.com',
  birthDate: ISODate('1970-10-01T00:00:00Z'),
  children: 2,
  address: { city: 'Livingston', street: '13 Garden Street' },
  interests: ['Pastry', 'Kung fu'],
  phones: []
});
db.people.insertOne({
  name: 'John Smith',
  email: 'john.smith@example.com',
  birthDate: ISODate('1990-12-24T00:00:00Z'),
  address: { city: 'Newport', street: '85 Bay Drive' },
  interests: ['Sunglasses'],
  phones: [
    { type: 'professional', number: '+1-202-555-0144' },
    { type: 'home', number: '+1-202-555-0186' }
  ]
});
```

### Inserting multiple documents

You can insert multiple documents at once by using the
[`insertMany`][mongodb-insert-many] method and passing it an array.

```js
db.people.insertMany([
  {
    name: 'Saul Goodman',
    email: 'saul.goodman@example.com',
    birthDate: ISODate('1960-11-12T00:00:00Z'),
    children: 0,
    address: { city: 'Albuquerque', street: '9800 Montgomery Blvd NE' },
    interests: ['Law', 'Money'],
    phones: []
  },
  {
    name: 'Jimmy McGill',
    email: 'jimmy.mcgill@example.com',
    birthDate: ISODate('1962-04-01T00:00:00Z'),
    children: 2,
    address: { city: 'Albuquerque', street: '160 Juan Tabo Blvd NE' },
    interests: ['Family', 'Falling'],
    phones: []
  }
]);
```

### Finding documents

Here are a few simple queries you can run with MongoDB's [find][find] method:

```js
// Find all people
db.people.find({});

// Find all people named John Doe
db.people.find({ name: 'John Doe' });

// Find all people living in Newport
db.people.find({ 'address.city': 'Newport' });

// Find all people that have a home phone number
db.people.find({ 'phones.type': 'home' });

// Find all people interested in Kung fu
db.people.find({ interests: 'Kung fu' });

// Find all people living in Albuquerque AND with 2 children
db.people.find({ 'address.city': 'Albuquerque', children: 2 });
```

#### Query operators

You can write more complex queries with query operators:

```js
// Find all people living in Newport or Livingston
db.people.find({ 'address.city': { $in: ['Newport', 'Livingston'] } });

// Find all people born after 1980
db.people.find({ birthDate: { $gt: ISODate('1980-01-01') } });

// Find all people with no phone numbers
db.people.find({ phones: { $size: 0 } });

// Find all people named John Smith OR living in Livingston
db.people.find({
  $or: [{ name: 'John Smith' }, { 'address.city': 'Livingston' }]
});
```

Read the documentation on [query operators][query-operators] to learn more about
these and other operators.

#### Projection

You can give a second parameter to `find` to specify which fields to return:

```js
// Find all people and get their name and address only
// ("SELECT name, address FROM people" in SQL)
db.people.find({}, { name: 1, address: 1 });

// Find all people named John Doe but without their interests or address
db.people.find({ name: 'John Doe' }, { address: 0, interests: 0 });
```

You can specify fields to include or fields to exclude, **not both**. The one
exception is `_id`, which you can exclude from an inclusion:

```js
// Find all people and get their name only, without their _id
db.people.find({}, { _id: 0, name: 1 });
```

#### Sort, paginate and count

```js
// Sort by descending name, skip one, return one
// ("... ORDER BY name DESC OFFSET 1 LIMIT 1" in SQL)
db.people.find({}).sort({ name: -1 }).skip(1).limit(1);

// Count the documents matching a filter (same filter as find)
db.people.countDocuments({ 'address.city': 'Newport' }); // 1
```

`skip`, `limit` and `countDocuments` are all you need to **paginate** a
collection in your API.

### Updating documents

```js
// Rename "John Smith" and add "Movies" to his interests
db.people.updateOne(
  { name: 'John Smith' },
  { $set: { name: 'John A. Smith' }, $push: { interests: 'Movies' } }
);

// Mark everyone as active
db.people.updateMany({}, { $set: { active: true } });
```

- The first argument is a **filter**, as with `find`.
- The second uses [**update operators**][update-operators]: `$set`, `$push`,
  `$inc`, etc.
- [`updateOne`][mongodb-update-one] changes the **first** match;
  [`updateMany`][mongodb-update-many] changes **all** of them.

#### Upserts

With `upsert: true`, an update **inserts** a document when **nothing
matches**:

```js
db.people.updateOne(
  { email: 'ned.stark@example.com' },
  { $set: { name: 'Ned Stark', children: 6 } },
  { upsert: true }
);
// { matchedCount: 0, upsertedCount: 1, insertedId: ObjectId('…'), … }
```

The new document also gets the **filter's fields**:

```js
{ _id: ObjectId('…'), email: 'ned.stark@example.com',
  children: 6, name: 'Ned Stark' }
```

#### Atomic operations

```js
// Add one child to John Doe
db.people.updateOne({ name: 'John Doe' }, { $inc: { children: 1 } });
```

- A write to **one document** is always **atomic**: nobody sees it half-done.
- `$inc` computes **in the database**. If two clients add 1 at the same time,
  you get +2. Reading the value, adding 1 in your code and writing it back
  might give +1 if the reads and writes overlap.

### Replacing documents

The [`replaceOne`][mongodb-replace-one] method replaces the **entire**
document. This is what a `PUT` request does in a REST API.

```js
db.people.replaceOne(
  { name: 'Saul Goodman' },
  { name: 'Gene', email: 'gene@example.com', children: 0 }
);

db.people.find({ name: 'Gene' });
[
  {
    _id: ObjectId('6abb6b0e2437811cd7e80aa8'),
    name: 'Gene',
    email: 'gene@example.com',
    children: 0
  }
];
```

The replacement is a plain document: it **cannot contain update operators**
like `$set` (`MongoInvalidArgumentError: Replacement document must not contain
atomic operators`).

### Removing documents

You can use [`deleteMany`][mongodb-delete-many] to remove documents from a
collection:

```js
// Remove all people who have 5 children
db.people.deleteMany({ children: 5 });
```

It removes all matching documents by default. **Careful:** an empty filter
matches everything, so `deleteMany({})` removes **all** people (don't run it
now, you will need them for the next slides). Use the
[`deleteOne`][mongodb-delete-one] method if you want to only remove the first
matching document:

```js
// Remove the first person found who likes chocolate
db.people.deleteOne({ interests: 'Chocolate' });
```

## Indexes

<!-- slide-front-matter class: center, middle -->

Indexes can support the efficient execution of queries and enforce constraints.

### Without an index

MongoDB must **scan the whole collection** (`COLLSCAN`). `explain()` shows the
plan it picked:

```js
db.people.find({ name: 'John Doe' }).explain().queryPlanner.winningPlan;
```

```js
{
  isCached: false,
* stage: 'COLLSCAN',
  filter: { name: { '$eq': 'John Doe' } },
  direction: 'forward'
}
```

### With an index

```js
db.people.createIndex({ name: 1 }); // 'name_1'
db.people.find({ name: 'John Doe' }).explain().queryPlanner.winningPlan;
```

```js
{
  isCached: false,
  stage: 'FETCH',
  inputStage: {
*   stage: 'IXSCAN',
    keyPattern: { name: 1 },
    indexName: 'name_1',
    ...
  }
}
```

The [index][create-index] **limits the documents MongoDB must inspect**. It
costs disk space and slows down writes a little, so index the fields **you
actually query**.

### Compound indexes

```js
db.people.createIndex({ 'address.city': 1, birthDate: 1 });

// Can use it: they start with the index's first field
db.people.find({ 'address.city': 'Newport' });
db.people.find({ 'address.city': 'Newport', birthDate: { $lt: … } });

// Cannot: birthDate alone is not a prefix of the index (COLLSCAN)
db.people.find({ birthDate: { $lt: ISODate('1980-01-01') } });
```

The **order of fields matters**: an index on `{ a, b }` serves queries on `a`
and on `a` + `b`, but not on `b` alone.

<!-- slide-notes -->

Sort direction also matters for multi-field sorts: the index serves
`{ a: 1, b: 1 }` and `{ a: -1, b: -1 }`, not `{ a: 1, b: -1 }`.

### Unique indexes

A unique index enforces uniqueness for the indexed fields:

```js
// Ensure that there are no two people with the same email
db.people.createIndex({ email: 1 }, { unique: true });

db.people.insertOne({ name: 'Johnny', email: 'john.doe@example.com' });
// MongoServerError: E11000 duplicate key error ...
//   dup key: { email: "john.doe@example.com" }
```

- Creating the index **fails if duplicates already exist**
- A **missing field counts as `null`**: two people without an email are
  duplicates
- MongoDB already creates a unique index on the `_id` field of every collection

Read the [documentation on indexes][indexes] to find out more about other types
of indexes.

## Resources

- [MongoDB CRUD operations][crud]
- [Data modeling][data-modeling]
- [db.collection.find][find] & [query operators][query-operators]
- [db.collection.insertOne][mongodb-insert-one] & [db.collection.insertMany][mongodb-insert-many]
- [db.collection.updateOne][mongodb-update-one] & [db.collection.updateMany][mongodb-update-many]
- [update operators][update-operators]
- [db.collection.replaceOne][mongodb-replace-one]
- [db.collection.deleteMany][mongodb-delete-many] & [db.collection.deleteOne][mongodb-delete-one]
- [db.collection.createIndex][create-index]
- [Indexes][indexes]
- [SQL comparison][sql-comparison]

[bson]: https://www.mongodb.com/resources/basics/json-and-bson
[create-index]: https://www.mongodb.com/docs/manual/reference/method/db.collection.createindex/
[crud]: https://www.mongodb.com/docs/manual/crud/
[data-modeling]: https://www.mongodb.com/docs/manual/data-modeling/
[find]: https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
[indexes]: https://www.mongodb.com/docs/manual/indexes/
[install]: https://github.com/MediaComem/comem-archioweb/blob/main/guides/install-mongodb.md
[query-operators]: https://www.mongodb.com/docs/manual/reference/mql/query-predicates/
[mongodb]: https://www.mongodb.com
[mongodb-insert-one]: https://www.mongodb.com/docs/manual/reference/method/db.collection.insertone/
[mongodb-insert-many]: https://www.mongodb.com/docs/manual/reference/method/db.collection.insertmany/
[mongodb-delete-one]: https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteone/
[mongodb-delete-many]: https://www.mongodb.com/docs/manual/reference/method/db.collection.deletemany/
[mongodb-replace-one]: https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceone/
[mongodb-update-one]: https://www.mongodb.com/docs/manual/reference/method/db.collection.updateone/
[mongodb-update-many]: https://www.mongodb.com/docs/manual/reference/method/db.collection.updatemany/
[sql-comparison]: https://www.mongodb.com/docs/manual/reference/sql-comparison/
[update-operators]: https://www.mongodb.com/docs/manual/reference/operator/update-field/
