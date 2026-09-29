# Mongoose

Learn how to use [Mongoose][mongoose], a Document-Object Mapper for [MongoDB][mongodb],
and how it differs from the [official Node.js MongoDB driver][mongodb-node-driver].

**You will need**

- A running [MongoDB][mongodb] 8.0 database

**Recommended reading**

- [MongoDB](../mongodb/)
- [npm](../npm/) and [Express](../express/) (for the integration example)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [MongoDB Node.js driver](#mongodb-nodejs-driver)
  - [The official driver](#the-official-driver)
- [What is Mongoose?](#what-is-mongoose)
  - [Object-Document Mapper (ODM)](#object-document-mapper-odm)
    - [Connect to the database](#connect-to-the-database)
    - [Create a schema](#create-a-schema)
    - [Create a model](#create-a-model)
    - [Create a document](#create-a-document)
    - [Saving documents](#saving-documents)
  - [Mongoose validations](#mongoose-validations)
    - [Handling validations](#handling-validations)
    - [Custom validations](#custom-validations)
  - [Unique constraints](#unique-constraints)
  - [Mongoose queries](#mongoose-queries)
    - [Query builder](#query-builder)
    - [Find by ID](#find-by-id)
    - [Update and delete](#update-and-delete)
  - [Debugging](#debugging)
  - [Driver or Mongoose?](#driver-or-mongoose)
- [Integrating Mongoose into Express](#integrating-mongoose-into-express)
  - [Install and connect Mongoose](#install-and-connect-mongoose)
  - [Create a schema and model](#create-a-schema-and-model)
  - [Implement the `GET /users` route](#implement-the-get-users-route)
  - [Implement the `POST /users` route](#implement-the-post-users-route)
  - [What about invalid input?](#what-about-invalid-input)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## MongoDB Node.js driver

<!-- slide-front-matter class: center, middle -->

The [official MongoDB driver][mongodb-node-driver] for Node.js

### The official driver

```js
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const people = client.db('archioweb').collection('people');

const result = await people.insertOne({ name: 'John Doe', age: 42 });
console.log(result.insertedId); // ObjectId('…')

const adults = await people.find({ age: { $gte: 18 } }).toArray();
await client.close();
```

- **The same methods as the shell**, with `await` (see the
  [Collection API][collection-api])
- Documents are **plain objects**: no schema, no validation
- **Mongoose is built on top of it**

## What is Mongoose?

<!-- slide-front-matter class: center, middle, image-header -->

<p class='center'><img src='images/mongoose.png' width='60%' /></p>

> "Mongoose provides a straight-forward, **schema-based** solution to **model** your application data. It includes built-in **type casting, validation, query building**, business logic hooks and more, out of the box."

### Object-Document Mapper (ODM)

Mongoose **maps JavaScript objects to MongoDB documents**, much like an
Object-Relational Mapper (ORM) maps objects to relational database tables.

<p class='center'><img src='images/schema-model-document.png' width='60%' /></p>

- A [**schema**][mongoose-guide] defines the **shape of the documents** in a
  collection.
- A [**model**][mongoose-model] is a **constructor** compiled from a schema.
- A [**document**][mongoose-document] is an instance of a model, stored in
  MongoDB.

<!-- slide-notes -->

ORM examples: Hibernate (Java), Active Record (Ruby), SQLAlchemy (Python).

#### Connect to the database

```js
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1/my-app');
```

- **`await` it**: if MongoDB isn't running, the error shows up **here**
  (`ECONNREFUSED`, after about 30 seconds) instead of in your first request.
- Mongoose keeps a **pool** of connections open for the whole app.

#### Create a schema

The schema defines the shape of the documents you want to save:

```js
import mongoose, { Schema } from 'mongoose';

// Define a schema
const blogSchema = `new Schema`({
  title: String,
  body: String,
  date: { type: Date, default: Date.now }, // Default value
  comments: [
    // Nested array of documents
    {
      body: String,
      date: Date
    }
  ],
  meta: {
    // Nested document
    votes: Number,
    favs: Number
  }
});
```

#### Create a model

A model links a schema to a **collection**:

```js
// models/blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({ /* ... */ });

*export default mongoose.model('Blog', blogSchema);
```

```js
// Anywhere else
import Blog from './models/blog.js';
```

The model `Blog` stores its documents in the **`blogs`** collection (lowercase,
plural).

<!-- slide-notes -->

You can also choose your own collection name if you prefer:

```js
mongoose.model('Blog', blogSchema, 'awesome-blog-collection');
```

#### Create a document

The model is a **constructor** that you can use to create documents:

```js
import `Blog` from './models/blog.js';

// Create a document with it
const blog = `new Blog`({
  title: 'Teaching Mongoose',
  body: 'So cool',
  comments: [
    { body: 'orly?', date: new Date(2015, 10, 20, 15, 14) },
    { body: 'yarly', date: new Date(2015, 10, 20, 15, 17) }
  ],
  meta: {
    votes: 0,
    favs: 3
  }
});
```

Fields that are **not in the schema are silently dropped** (e.g. `role:
'admin'`), so you can pass `req.body` without storing unexpected fields.

#### Saving documents

```js
const blog = new Blog({ title: 'Teaching Mongoose' });
blog._id; // ObjectId('…'): already set
blog.isNew; // true

await `blog.save()`; // Inserts the document

blog.meta.votes = 5;
await `blog.save()`; // Updates only what changed: { $set: { 'meta.votes': 5 } }
```

`save()` **inserts** new documents and **updates** existing ones. To create and
save in one step: `await Blog.create({ … })`.

### Mongoose validations

Mongoose schemas have built-in validations:

```js
const personSchema = new Schema({
  name: {
    type: String, // Type validation
    `required: true`, // Mandatory
    `minLength: [ 3, 'Name is too short' ]`, // Minimum length
    `maxLength: 20` // Maximum length
  },
  address: {
    city: {
      type: String,
      `required: true`
    }
  },
  honorific: {
    type: String,
    `enum: [ 'Mr', 'Mrs', 'Mx', 'Dr' ]` // Limit valid values
  },
  age: {
    type: Number,
    `min: 0`, // Minimum value
    `max: 122` // Maximum value
  },
  interests: [{ type: String, `maxLength: 10` }]
});
```

#### Handling validations

The promise returned by `save()` (or `create()`) is rejected if validations
fail:

```js
try {
  await Person.create({ name: 'Bo', age: -4, honorific: 'Great' });
} catch (err) {
  if (err.name !== 'ValidationError') {
    throw err;
  }

  for (const [path, error] of Object.entries(err.errors)) {
    console.log(path, error.message);
  }
}
```

```txt
address.city Path \`address.city` is required.
name Name is too short
honorific \`Great` is not a valid enum value for path \`honorific`.
age Path \`age` (-4) is less than minimum allowed value (0).
```

#### Custom validations

You can also write your own validators.

For example, this validates that the `name` property of users is in lower case:

```js
const userSchema = new Schema({
  name: {
    type: String,
*   validate: {
*     // Returns true if the name is valid (in lower case)
*     validator: function(value) {
*       return value.toLowerCase() === value;
*     },
*     // Custom error message
*     message: '{VALUE} is not in lower case'
*   }
  }
});
```

### Unique constraints

```js
const personSchema = new Schema({
  email: { type: String, required: true, `unique: true` },
});
```

`unique` is **not a validator**: it creates a **unique index**.

- A duplicate makes `save()` reject with a **`MongoServerError`, code 11000**,
  not a `ValidationError`.
- The index is built when the app starts. If duplicates **already exist**, it
  **silently fails**, and nothing is enforced.

To create a unique index on **multiple fields**, use `index()` on the schema:

```js
`personSchema.index`({ name: 1, age: 1 }, { unique: true });
```

### Mongoose queries

You can make MongoDB queries with the `find()` or `findOne()` methods of
Mongoose models:

```js
const people = await Person
* .find({
*   name: /arnold/i,
*   'address.city': 'Los Angeles',
*   age: { $gt: 17, $lt: 80 },
*   interests: { $in: ['shooting', 'talking'] }
* })
  .limit(10)
  .sort({ name: -1 })
  .select({ name: 1, address: 1 })
* .exec();

console.log(\`Found ${people.length} people`);
```

#### Query builder

You can also use chainable query methods:

```js
const people = await Person
  .find()
* .where('name').equals(/arnold/i)
* .where('address.city').equals('Los Angeles')
* .where('age').gt(17).lt(80)
* .where('interests').in(['shooting', 'talking'])
  .limit(10)
  .sort('-name')
  .select('name address')
  .exec();

// Count the matching documents instead of retrieving them
const total = await Person.countDocuments({ age: { $gt: 17 } }).exec();
```

The builder is handy when the filters depend on the request (e.g. optional
query parameters).

#### Find by ID

```js
const person = await Person.findById(req.params.id).exec();
if (!person) {
  // No person with that ID: respond with 404
}
```

A malformed ID such as `abc` does not give `null`: the query **rejects** with a
**`CastError`**. Check it first:

```js
if (!mongoose.isValidObjectId(req.params.id)) {
  // Respond with 404 too
}
```

#### Update and delete

```js
// Load, change and save: validators run
person.set(req.body);
await person.save();

// In one step: validators run only if you ask
const updated = await Person.findByIdAndUpdate(id, req.body, {
  returnDocument: 'after', // Otherwise you get the old version
  runValidators: true
});

// Returns the deleted document, or null
const deleted = await Person.findByIdAndDelete(id);
```

### Debugging

Sometimes you want to see the queries Mongoose is sending to the database:

```js
mongoose.set('debug', true);
```

You will then see them in your CLI log:

```txt
Mongoose: people.find({ name: /arnold/i, 'address.city': 'Los Angeles',
age: { '$gt': 17, '$lt': 80 }, interests: { '$in': [ 'shooting', 'talking' ]
}}, { limit: 10, sort: { name: -1 }, projection: { name: 1, address: 1 } })
```

(It prints each query on **one line**; it is wrapped here to fit the slide.)

### Driver or Mongoose?

<!-- slide-column -->

**Driver**

- The shell's API, nothing more
- Plain objects in, plain objects out
- You validate everything yourself

<!-- slide-column -->

**Mongoose**

- Schemas, casting and **validation**
- Query builder, population (later)
- One more layer to learn

<!-- slide-container -->

`Model.collection` gives you the underlying driver collection if you ever need
it.

## Integrating Mongoose into Express

<!-- slide-front-matter class: center, middle -->

A typical Mongoose usage example with Express, one of the most popular Node.js
web framework.

### Install and connect Mongoose

Assuming you have created an Express application from the [Express starter
application][express-starter], go into its directory and install Mongoose:

```bash
$> cd /path/to/projects/my-app
$> npm install mongoose
```

In `app.js`, below the other imports:

```js
import mongoose from 'mongoose';

await mongoose.connect(
  process.env.DATABASE_URL ?? 'mongodb://127.0.0.1/my-app'
);
```

Your Express application is now connected to MongoDB (to the `my-app` database).
`DATABASE_URL` lets you use **another database** in production and in tests.

The starter includes a `GET /users` route in `routes/users.js` that doesn't do
much yet. Let's make it list users from the database!

### Create a schema and model

We'll need a Mongoose model for users. Create a new `models` directory with a
`user.js` file inside it:

```js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the schema for users
const userSchema = new Schema({
  name: { type: String, required: true }
});

// Create the model from the schema and export it
export default mongoose.model('User', userSchema);
```

### Implement the `GET /users` route

Replace the contents of `routes/users.js` with:

```js
import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.get('/', async function (req, res) {
* const users = await User.find().sort('name').exec();
* res.send(users);
});

export default router;
```

Start your app with `npm run dev` (it restarts by itself when you save a file)
and try it. There are no users yet:

<!-- slide-column -->

```http
GET /users HTTP/1.1
```

<!-- slide-column -->

```http
HTTP/1.1 200 OK
Content-Type: application/json

[]
```

### Implement the `POST /users` route

Add this route to `routes/users.js`:

```js
router.post('/', async function (req, res) {
  // Create and save a document from the JSON request body
  const user = await User.create(req.body);
  res
    .status(201)
    .set('Location', \`/users/${user.id}`)
    .send(user);
});
```

<!-- slide-column -->

```http
POST /users HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe"
}
```

<!-- slide-column -->

```http
HTTP/1.1 201 Created
Location: /users/6abb6c55…
Content-Type: application/json

{
  "name": "John Doe",
  "_id": "6abb6c55…",
  "__v": 0
}
```

<!-- slide-container -->

A new `GET /users` now returns this user (with `_id`, `name` and `__v`).

### What about invalid input?

<!-- slide-column -->

```http
POST /users HTTP/1.1
Content-Type: application/json

{ "name": { "first": "John" } }
```

<!-- slide-column -->

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{ "message": "User validation
  failed: name: Cast to string
  failed…" }
```

<!-- slide-container -->

Express 5 sends the rejected promise to your error handler, so the app keeps
running. But this is the **client's** mistake: it should be a `4xx`. [Express
best practices](../express-best-practices/) shows how to fix it.

## Resources

**Documentation**

- [Official MongoDB Node.js driver][mongodb-node-driver]
  - [Collection API][collection-api]
- [Mongoose][mongoose]
  - [Getting started][mongoose-getting-started]
  - [Guide][mongoose-guide]
  - [Validation][mongoose-validation]
  - [Queries][mongoose-queries]
  - [API documentation][mongoose-api]

[collection-api]: https://mongodb.github.io/node-mongodb-native/7.6/classes/Collection.html
[express-starter]: https://github.com/MediaComem/comem-archioweb/tree/main/subjects/express/starter
[mongodb]: https://www.mongodb.com
[mongodb-node-driver]: https://mongodb.github.io/node-mongodb-native/
[mongoose]: https://mongoosejs.com
[mongoose-api]: https://mongoosejs.com/docs/api/mongoose.html
[mongoose-document]: https://mongoosejs.com/docs/documents.html
[mongoose-getting-started]: https://mongoosejs.com/docs/index.html
[mongoose-guide]: https://mongoosejs.com/docs/guide.html
[mongoose-model]: https://mongoosejs.com/docs/models.html
[mongoose-queries]: https://mongoosejs.com/docs/queries.html
[mongoose-validation]: https://mongoosejs.com/docs/validation.html
