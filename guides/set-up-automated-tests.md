# Set up automated testing for an Express.js REST API

This guide explains how to set up [automated tests][automated-testing] for an
HTTP API implemented with [Express.js][express] and [Mongoose][mongoose], using
the following tools:

- The [Node.js test runner][node-test] (`node --test`), to write and run your
  tests
- The [`node:assert`][node-assert] module, to make assertions
- [SuperTest][supertest], to make HTTP requests to your API

> The first two come with Node.js: there is nothing to install. There are many
> other tools that can do the same, such as [Vitest][vitest], [Jest][jest] or
> [Mocha][mocha]. You will find them in many tutorials, but you do not need them
> for this course.
>
> Note that the code in this tutorial uses [Promises][promise] and [async
> functions][async-await]. Read [this guide](./async-js.md) if you are not
> familiar with the subject.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Requirements](#requirements)
- [Run your first test](#run-your-first-test)
- [Your domain model & API](#your-domain-model--api)
- [Set up your test suite](#set-up-your-test-suite)
  - [Use a separate database for tests](#use-a-separate-database-for-tests)
- [Write your first test](#write-your-first-test)
  - [Disconnect from the database once the tests are done](#disconnect-from-the-database-once-the-tests-are-done)
  - [Get rid of logs while testing](#get-rid-of-logs-while-testing)
    - [Request logs](#request-logs)
    - [Database query logs](#database-query-logs)
    - [Other logs](#other-logs)
- [Run your tests twice](#run-your-tests-twice)
- [Reproducible tests](#reproducible-tests)
  - [Protect your other databases](#protect-your-other-databases)
- [Write more detailed assertions](#write-more-detailed-assertions)
- [Check what was saved in the database](#check-what-was-saved-in-the-database)
- [Write a second test](#write-a-second-test)
- [Authenticate](#authenticate)
- [Test fixtures](#test-fixtures)
- [Test an error case](#test-an-error-case)
- [Am I testing every possible scenario?](#am-i-testing-every-possible-scenario)
- [Check your test coverage](#check-your-test-coverage)
  - [Optional: an HTML coverage report](#optional-an-html-coverage-report)
- [Avoid problems with parallelism](#avoid-problems-with-parallelism)
- [Optional: run your tests on every push](#optional-run-your-tests-on-every-push)
- [Tips](#tips)
- [Documentation](#documentation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

- [Node.js][node] 22.9 or later
- You are using [npm][npm] to manage your dependencies.
- A working [Express.js][express] application providing the HTTP API you wish to
  test, for example based on the [Express starter application][express-starter].
- You are using [Mongoose][mongoose] to store your data in a [MongoDB][mongo]
  database, connected in your `app.js` file as shown in the [Mongoose
  subject][mongoose-subject].
- Your API uses token-based authentication with JSON Web Tokens, as shown in
  the [authentication subject][express-auth].
- Your error handler responds with `409 Conflict` for duplicates and `422
  Unprocessable Entity` for validation errors, as shown in [Express best
  practices][express-best-practices].

## Run your first test

Create a `tests` folder in your project. Then create a `tests/example.test.js`
file with the following contents:

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';

// Define a test.
test('should work', function () {
  assert.equal(1 + 1, 2);
});
```

- `test` comes from the built-in `node:test` module. It defines a test: a name
  and a function to run.
- `assert.equal` comes from the built-in `node:assert/strict` module. It is an
  **assertion**: it throws an error, and therefore makes the test fail, if the
  two values are not equal.

To run your tests, define a new `test` script in the `scripts` section of your
`package.json` file:

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "node --test"
}
```

You can now simply run `npm test` to execute your test(s):

```bash
$> npm test

> express-api@0.1.0 test
> node --test

✔ should work (0.370333ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 54.5235
```

> The `--test` option looks for test files in your project, for example files
> whose name ends with `.test.js`, and runs them. You do not have to list them.

> [!WARNING]
> Do **not** name your folder `test` (singular): Node.js would run **every**
> file in it as a test file, including the helper files you will add later.

## Your domain model & API

The rest of this tutorial assumes that you have a Mongoose schema like the one
in the [authentication subject][express-auth], which stores a hash of each
user's password and hides it from API responses:

```js
const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  passwordDigest: { type: String, required: true }
});

userSchema.set('toJSON', {
  transform: transformJsonUser
});

function transformJsonUser(doc, json, options) {
  // Remove the hashed password and the version key from the generated JSON.
  delete json.passwordDigest;
  delete json.__v;
  return json;
}
```

And the following routes:

- `POST /users` hashes the password in the request body with bcrypt, creates a
  user, and responds with `201 Created` and a `Location` header.
- `GET /users` requires a valid JWT in the `Authorization` header, and lists
  users by ascending name.

If that is not the case, adapt the tests to your domain model and API. For
example, if the field that stores the hash is called `password`, use that name
instead of `passwordDigest` in your tests.

## Set up your test suite

You can delete the `tests/example.test.js` file you created earlier. Create a
`tests/users.test.js` file instead, since we want to test the 2 user-related
routes:

```js
import { describe, it } from 'node:test';

describe('POST /users', function () {
  it.todo('should create a user');
});

describe('GET /users', function () {
  it.todo('should retrieve the list of users');
});
```

> Note the nested `describe`/`it` structure. It helps you structure your tests
> when writing them. Everything that is in the `describe('POST /users')` block
> describes how that route should work. The `it('should create a user')` block
> inside describes one thing that route should do. Combining the two gives you
> the whole test specification: `POST /users should create a user`.
>
> This practice of **specifying** what the software should do in brief
> sentences comes from [Behavior-Driven Development][bdd].

`it.todo` creates a **pending test**, a test that is not yet implemented. If you
run your tests with `npm test` now, you should see the tests marked as `# TODO`:

```bash
$> npm test

> express-api@0.1.0 test
> node --test

▶ POST /users
  ✔ should create a user (0.458042ms) # TODO
✔ POST /users (1.060125ms)
▶ GET /users
  ✔ should retrieve the list of users (0.082458ms) # TODO
✔ GET /users (0.160666ms)
ℹ tests 2
ℹ suites 2
ℹ pass 0
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 2
ℹ duration_ms 53.948084
```

> You could use this functionality to prepare your test suite before writing the
> tests themselves. If you write your tests first using [Test-Driven
> Development][tdd], you could even write your whole test suite before
> implementing your API!

### Use a separate database for tests

When working on an existing application, you probably have a development
database containing some data. You don't want your tests to mess with that data.
It's good practice to **switch to a different database for testing**.

Your `app.js` file should contain a line that looks like this:

```js
await mongoose.connect(
  process.env.DATABASE_URL ?? 'mongodb://127.0.0.1/my-app'
);
```

This means that you can switch the database by setting the `$DATABASE_URL`
environment variable. This is useful not only when deploying in a production
environment, but also for the test environment.

Create a `.env.test` file at the root of your project with the following
contents:

```
NODE_ENV=test
DATABASE_URL=mongodb://127.0.0.1/my-app-test
```

Then **update** the `test` script in your `package.json` file to load it:

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "node --env-file=.env.test --test"
}
```

The [`--env-file` option][node-env-file] loads the variables in `.env.test`
before your code runs. In this example, your tests will use the `my-app-test`
database on `127.0.0.1` (localhost) instead of the `my-app` database. That way,
your tests will modify a separate database without touching your development
data. You will use `NODE_ENV` later in this guide.

If your application needs any other environment variable, add it to
`.env.test`. For example, if your `config.js` file requires a `JWT_SECRET` to
sign authentication tokens (as in the [authentication subject][express-auth]),
your application refuses to start without it, and so do your tests:

```
JWT_SECRET=not-a-secret-only-used-in-tests
```

> [!IMPORTANT]
> Unlike your `.env` file, **commit** `.env.test` so that your teammates (and
> your CI, if you set it up) can run the tests. This means that it must
> **never** contain a real secret: the JWT secret above is only used to sign
> tokens in your tests.
>
> If your `.gitignore` file ignores `/.env.*` (for example for an `.env.atlas`
> file), add an exception for `.env.test` below that line:
>
> ```
> /.env.*
> !/.env.test
> ```

> [!CAUTION]
> **Variables set in your shell take precedence over `.env.test`.** If you have
> exported `DATABASE_URL` in your terminal, for example to run a script against
> your MongoDB Atlas database, your tests will use **that** database. You will
> protect yourself against this [later](#protect-your-other-databases).

## Write your first test

Let's write the test to create a user (`POST /users should create a user`).
You will need to make an HTTP POST request. [SuperTest][supertest] is an HTTP
test library which is designed to test Node.js HTTP servers. You can install it
with npm:

```bash
$> npm install --save-dev supertest
```

Import it into the `tests/users.test.js` file by adding the following line below
the `node:test` import:

```js
import supertest from 'supertest';
```

You will also import your Express.js application, which is exported from the
`app.js` file at the root of your repository. Add the following line to import
it:

```js
import app from '../app.js';
```

Now you can implement your test. **Replace the `it.todo('should create a
user')` call** with an `it` call with a test function. It should look like
this:

```js
describe('POST /users', function () {
  it('should create a user', async function () {

  });
});
```

Add the following contents inside the `async function`:

```js
const res = await supertest(app)
  .post('/users')
  .send({
    name: 'John Doe',
    password: '1234'
  })
  .expect(201)
  .expect('Content-Type', /json/);
```

SuperTest uses chained calls to let you build your HTTP call step by step. You
first call `supertest(app)` to give your app to the SuperTest client, then use
its various chainable methods:

- `.post('/path')` makes a POST request (or `.get` for a GET request, `.patch`
  for a PATCH request, etc).
- `.send(body)` lets you set the request body. It is serialized as JSON by
  default.
- `.expect(number)` is an **assertion**. It lets you specify which status code
  you expect the response to have. If your API responds with a different status
  code, an error will be thrown indicating that there was a problem.
- `.expect('header', value)` lets you specify the value you expect a specific
  header to have in the response. In this case, you expect your API to send back
  JSON in the response (the regular expression `/json/` matches any string that
  contains the word `json`, like `application/json`).

> SuperTest calls your Express application **directly**: you do not need to
> start your server with `npm run dev` before running your tests. Check the
> [SuperTest documentation][supertest] for more examples and information on the
> various methods.

If you run `npm test` now, you should see something like this:

```bash
$> npm test

> express-api@0.1.0 test
> node --env-file=.env.test --test

POST /users 201 82.959 ms - 52
▶ POST /users
  ✔ should create a user (94.631834ms)
✔ POST /users (95.195292ms)
▶ GET /users
  ✔ should retrieve the list of users (0.063292ms) # TODO
✔ GET /users (0.155875ms)
```

### Disconnect from the database once the tests are done

You may notice that the `npm test` command does not exit and that you have to
stop it manually with `Ctrl-C`. This is because Mongoose is not designed to work
with tests: it is designed to stay connected to the database. The test runner
waits for your test file to finish, which never happens while the connection is
open.

You have to tell Mongoose to disconnect after your tests are done. Import
Mongoose below the other imports:

```js
import mongoose from 'mongoose';
```

Add `after` to the list of functions you import from `node:test`:

```js
import { after, describe, it } from 'node:test';
```

And add this at the bottom of the file:

```js
after(() => mongoose.disconnect());
```

> Here you are using [hooks][node-test-hooks]. The `before` and `after`
> functions provided by `node:test` allow you to run code before or after the
> tests in a file (or in a `describe` block, if you call them inside it).

### Get rid of logs while testing

Your test results are easier to read when nothing else is printed in the
middle of them.

#### Request logs

You may have a request logger in your Express.js application. If you started
from the Express starter application, you saw this line in the `npm test`
command's output:

```
POST /users 201 82.959 ms - 52
```

It is because of this line in `app.js`:

```js
app.use(logger('dev'));
```

This middleware logger will log all HTTP requests made to the application. You
do not need this information while testing (you already know that you are
calling `POST /users` in this test).

You can conditionally omit this middleware in test mode:

```js
// Log requests (except in test mode).
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
```

The `NODE_ENV=test` line in your `.env.test` file sets this variable when you
run `npm test`.

#### Database query logs

If you have enabled Mongoose's debug mode to see the queries it sends to
MongoDB, every query made by your tests is printed as well:

```
Mongoose: users.insertOne({ name: 'John Doe', passwordDigest: '$2b$10$uFJ4…', _id: ObjectId("6ae90b76b9fe41c78c223a9e"), __v: 0}, {})
```

Enable it the same way, only outside of test mode:

```js
// Log database queries (except in test mode).
if (process.env.NODE_ENV !== 'test') {
  mongoose.set('debug', true);
}
```

#### Other logs

Any `console.log` call in your application, for example in a middleware you
used to try things out, also prints in the middle of your test results.
Remove the ones you no longer need, and use the [`debug` package][debug]
for the others, as shown in [Express best practices][express-best-practices]:

```js
import createDebugger from 'debug';

const debug = createDebugger('my-app:app');

// ...
debug('Hello World!');
```

`debug` prints nothing unless you ask for it with the `DEBUG` environment
variable. That is also useful when a test fails and you want to see what your
application was doing:

```bash
$> DEBUG=my-app:* npm test
```

> This works because variables set in your shell take precedence over
> `.env.test`. For the same reason, if you have exported `DEBUG` in your
> terminal, your tests will print those logs too.

## Run your tests twice

Your schema has a unicity constraint on the `name` property of users. This
illustrates a problem that is often encountered with testing.

The first time you ran `npm test`, it worked, since there were no users in the
database. Run it a second time, and it will fail because it is trying to insert
the same user again:

```bash
$> npm test
...
✖ failing tests:

test at tests/users.test.js:9:3
✖ should create a user (93.787792ms)
  Error: expected 201 "Created", got 409 "Conflict"
```

Your test changes behavior depending on the state of the database.

## Reproducible tests

Your automated tests should always behave the same way. In other words, they
should be **reproducible**. There are generally 2 solutions to achieve this:

- Make sure that the **initial state is always the same** when the test runs
  (e.g. the state of the database).
- Or, make sure that the test **uses different (probably random) data every
  time** to avoid collisions, especially when it comes to unicity constraints.

Which solution is best is debatable. In this tutorial, we will use the first
one: you will make sure that when each test runs, the state of the database is
always the same.

The simplest way to do that is to **wipe the database clean before each test**.
This ensures that any test will always start with the same state: nothing.

Create a new `tests/utils.js` file with the following function:

```js
import User from '../models/user.js';

export async function cleanUpDatabase() {
  await Promise.all([User.deleteMany().exec()]);
}
```

> This new `cleanUpDatabase` function uses your Mongoose model to delete all
> documents. You could add more `deleteMany` calls for other models to the
> `Promise.all([])` array to delete other collections in parallel.

Import this new function at the top of the `tests/users.test.js` file:

```js
import { cleanUpDatabase } from './utils.js';
```

Add `beforeEach` to the list of functions you import from `node:test`, then call
it before your `describe` calls:

```js
beforeEach(cleanUpDatabase);
```

> You are using [hooks][node-test-hooks] again. The `beforeEach` and `afterEach`
> functions allow you to run code before or after each test runs.

You should now be able to run `npm test` several times in a row without error.
Since the database is wiped every time before your test runs, it can keep
creating the same user with the same name every time.

### Protect your other databases

`cleanUpDatabase` deletes **everything**, before **every** test. If your tests
ever connect to the wrong database, for example because you have exported a
`DATABASE_URL` variable for your MongoDB Atlas database in your terminal, they
will wipe it.

Make the function refuse to clean up a database whose name does not end with
`-test`:

```js
import mongoose from 'mongoose';

import User from '../models/user.js';

export async function cleanUpDatabase() {
  // Refuse to wipe a database that is not meant for tests.
  if (!mongoose.connection.name.endsWith('-test')) {
    throw new Error(`Refusing to clean up database ${mongoose.connection.name}`);
  }

  await Promise.all([User.deleteMany().exec()]);
}
```

If your tests connect to another database, they will now all fail with this
error instead of deleting your data.

> This works because your `app.js` file waits for the connection with `await
> mongoose.connect(…)`, so the name of the database is known by the time your
> tests import your application.

## Write more detailed assertions

So far, your test makes a POST request on `/users` and checks that the response
has the status code `201 Created` with a `Content-Type` header indicating that
the response is JSON.

That's nice, but you are not checking what is in the response body yet. With
SuperTest, the response object (`res`) has a `body` property which contains the
parsed JSON body. You can make assertions on it too, with the
[`node:assert/strict`][node-assert] module. Import it at the top of the file:

```js
import assert from 'node:assert/strict';
```

Then add the following assertions to your test after the SuperTest call chain:

```js
// Check the generated ID, then the rest of the body.
const { _id, ...rest } = res.body;
assert.match(_id, /^[0-9a-f]{24}$/);
assert.deepEqual(rest, { name: 'John Doe' });

// Check that the Location header points to the new user.
assert.equal(res.get('Location'), `/users/${_id}`);
```

When testing a particular API route, **you should make assertions on everything
your route does that is expected to be used by the end user**. You want to make
sure that your API works as advertised. For example: check the status code,
check important headers, check the response body.

> You cannot check the exact value of the user's ID because you cannot know it
> until the user has been created. So you take it out of the body with
> [destructuring][destructuring], and check that it has the format of a MongoDB
> ID with `assert.match` and a regular expression: 24 hexadecimal characters.
>
> `assert.deepEqual` then compares **the rest of the body** with the object you
> expect. It checks all the properties and their values, and it fails if the
> body contains **other properties you were not expecting**. That way, when you
> add more properties to your schema, the test will remind you that you should
> update it.
>
> This also checks something important that is **not** in the response: the
> password hash (`passwordDigest`). Your model removes it from the JSON, along
> with `__v`, a version number added by Mongoose for [optimistic concurrency
> control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control). If a
> change ever exposed the hash in your API, this test would fail.

## Check what was saved in the database

Your test now checks everything your API **responds**, but not what it **did**.
There could conceivably be a bug where the API gives you the correct answer even
though it saved something slightly different to the database (or did not save
it at all). Your test can query the database itself to make sure.

Add these imports at the top of the `tests/users.test.js` file, with the others:

```js
import bcrypt from 'bcrypt';

import User from '../models/user.js';
```

Then add the following assertions at the end of your `should create a user`
test:

```js
// Check that the user has been saved to the database.
const user = await User.findById(_id).exec();
assert.ok(user, 'the user was not saved to the database');

// Check the saved attributes, apart from the password digest.
const { passwordDigest, ...attributes } = user.toObject({
  flattenObjectIds: true
});
assert.deepEqual(attributes, { _id, name: 'John Doe', __v: 0 });

// Check that the password was hashed, not stored as is.
assert.notEqual(passwordDigest, '1234');
assert.ok(
  await bcrypt.compare('1234', passwordDigest),
  'the password digest does not match the password'
);
```

- `User.findById(_id)` looks for the user with the ID that your API sent back.
  It gives you `null` if there is none, which makes `assert.ok` fail with the
  message you passed as its second argument.
- `user.toObject()` turns the Mongoose document into a plain object with only
  the attributes that are stored in the database. The `flattenObjectIds` option
  turns the ID into a string, so that you can compare it with the one from the
  response. Unlike the response, it contains the password hash and `__v`.
- You take the password hash out with destructuring, as you did with the ID
  earlier, and compare **all the other attributes at once** with
  `assert.deepEqual`.
- You cannot compare the hash with an exact value: bcrypt adds a random salt, so
  hashing the same password twice gives two different hashes. Instead, you check
  that it is not the password itself, and that `bcrypt.compare` accepts the
  password, like your login route will.

You could have checked each attribute separately with `assert.equal(user.name,
'John Doe')`. But a single `deepEqual` also fails when the database contains
**attributes you did not expect**. Say you later add a `role` property to your
schema with a default value. The test then fails and shows you the new
property:

```bash
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected

    {
      name: 'John Doe',
  +   role: 'user'
    }
```

This reminds you to decide what the right value is when a user is created
through your API, and to write it down in your test. If you only check the
attributes you know about, your test keeps passing while your API starts
saving something that nobody has checked, for example a new user who gets
`admin` as their role by default.

> Your API already depends on bcrypt to hash passwords, so there is nothing to
> install.

## Write a second test

Let's test the application's other route. **Replace the `it.todo('should
retrieve the list of users')` call** with an `it` call with a test function. It
should look like this:

```js
describe('GET /users', function () {
  it('should retrieve the list of users', async function () {

  });
});
```

Add the following contents inside the `async function`:

```js
const res = await supertest(app)
  .get('/users')
  .expect(200)
  .expect('Content-Type', /json/);
```

This is very similar to the previous test. Note that you are not using `.send`
this time. Since this is a GET request, no request body can be sent.

Make an assertion on the response body:

```js
assert.deepEqual(res.body, []);
```

If you run `npm test` now, this test fails:

```bash
$> npm test
...
✖ failing tests:

test at tests/users.test.js:34:3
✖ should retrieve the list of users (4.430792ms)
  Error: expected 200 "OK", got 401 "Unauthorized"
```

## Authenticate

The `GET /users` route requires authentication, so the test fails because the
request is not properly authenticated. You must send a valid bearer token in
the `Authorization` header.

Here's a function you will be able to use later to generate a valid token. You
can add it to `tests/utils.js`, with the two imports:

```js
import jwt from 'jsonwebtoken';

import { jwtSecret } from '../config.js';

// ...

export function generateValidJwt(user) {
  // Generate a valid JWT which expires in 7 days.
  return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '7d' });
}
```

> [!NOTE]
> This code assumes that you have a `config.js` file from which you export a
> `jwtSecret` variable with which JWTs are signed. Remember to add `JWT_SECRET`
> to your `.env.test` file (see [above](#use-a-separate-database-for-tests)).

But you need a pre-existing user in the database before you can generate a
token. And the database is currently empty when the test runs since it is
cleaned before each test runs.

## Test fixtures

In the case of the `POST /users` test, it was necessary to have an empty
database to avoid issues with the unicity constraint. But it's a bit of a
problem for the `GET /users` test: with the database empty, the API will always
respond with an empty list. That's not a really good test of the list
functionality. Also, if you have authentication in place, you need a user to
authenticate.

You need specific data to already be in the database before you run the test, so
that you will know what the expected result is. This is what's called a [test
fixture][fixture]: something you use to consistently test a piece of code.

Because each test is different, **each should set up its own fixtures** so that
the initial state is exactly as expected.

In the case of `GET /users`, you need some users in the database before you
attempt to retrieve the list. To create them, you will use the `User` model that
you imported earlier.

You now need to make sure that some users are created **before the test runs**.
You can use the `beforeEach` hook. Just make sure to put it in the right place.
You want these fixtures to be created for the `GET /users` test, but not for the
`POST /users` test. You can achieve this by putting it inside the
`describe('GET /users', ...)` block: it will only apply to tests in that block.

Here's how it should look like:

```js
describe('GET /users', function () {
  let johnDoe;
  let janeDoe;
  beforeEach(async function () {
    // Create 2 users before retrieving the list.
    [johnDoe, janeDoe] = await Promise.all([
      User.create({ name: 'John Doe', passwordDigest: 'not-a-real-hash' }),
      User.create({ name: 'Jane Doe', passwordDigest: 'not-a-real-hash' })
    ]);
  });

  it('should retrieve the list of users', async function () {
    // ...
  });
});
```

> Your schema requires a `passwordDigest`, so the fixtures need one. Nobody logs
> in with these users in this test: you will generate their tokens directly. So
> it does not need to be a real bcrypt hash, which would also slow your tests
> down.

To authenticate, first import the `generateValidJwt` function from your
`utils.js` file:

```js
import { cleanUpDatabase, generateValidJwt } from './utils.js';
```

Then modify your request to include a valid `Authorization` header with
SuperTest's `set` method:

```js
const token = generateValidJwt(johnDoe);
const res = await supertest(app)
  .get('/users')
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  .expect('Content-Type', /json/);

// ...
```

If you run `npm test` now, your test will fail because you made an assertion
that the list should be empty. But thanks to the fixtures you created, it now
has 2 users:

```bash
$> npm test
...
✖ failing tests:

test at tests/users.test.js:45:3
✖ should retrieve the list of users (18.094583ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected

  + [
  +   {
  +     _id: '6ae90bc80953ea3e408fe42b',
  +     name: 'Jane Doe'
  +   },
  +   {
  +     _id: '6ae90bc80953ea3e408fe42a',
  +     name: 'John Doe'
  +   }
  + ]
  - []
```

The lines starting with `+` are what your API actually sent, and the lines
starting with `-` are what your test expected.

Update the assertion to fit the new data:

```js
assert.deepEqual(res.body, [
  { _id: janeDoe.id, name: 'Jane Doe' },
  { _id: johnDoe.id, name: 'John Doe' }
]);
```

You are testing several things with this one assertion:

- As before, you are checking that the records in the database (the users in
  this case) have been correctly sent in the response with the expected
  properties, and no other properties (in particular, no password hash). This
  time you know their IDs, since you created them yourself: `johnDoe.id` is the
  ID as a string.
- You are checking that the list contains exactly 2 users.
- You are checking that the list is sorted in the correct order (by ascending
  name): `Jane Doe` must be first and `John Doe` second.

## Test an error case

So far you have only tested what happens when everything goes well. But your API
must also behave correctly when it **refuses** a request. For example, the
unicity constraint on names means that `POST /users` must respond with `409
Conflict` if the name is already taken.

Add a second test to the `describe('POST /users', ...)` block:

```js
it('should not create a user with a name that already exists', async function () {
  // Create a user with the same name first.
  await User.create({ name: 'John Doe', passwordDigest: 'not-a-real-hash' });

  const res = await supertest(app)
    .post('/users')
    .send({
      name: 'John Doe',
      password: '1234'
    })
    .expect(409)
    .expect('Content-Type', /json/);

  assert.deepEqual(res.body, { message: 'name already exists' });

  // Check that no other user was created.
  assert.equal(await User.countDocuments().exec(), 1);
});
```

This test creates its own fixture (the existing user), then checks the status
code and the error message. Finally, it checks the database itself: a refused
request must not have changed anything.

> The status code and message come from the error handler shown in [Express best
> practices][express-best-practices]. If yours is different, adapt the test.

## Am I testing every possible scenario?

You now have partial coverage on these two `POST /users` and `GET /users`
routes. But the tests you have written cover only a few scenarios.

When writing automated tests, you should attempt to cover all likely scenarios.
Here's a few examples of some tests you could add to this small project:

- If you have validations, write tests that make sure that you cannot create a
  user with invalid data. For example, attempt to create a user with an empty
  name, a name that's too long, or no password at all. Check that it fails with
  `422 Unprocessable Entity`.
- Test what happens when the user list is empty (the first assertion you wrote
  for `GET /users`). Once your system goes to production, it may never produce
  an empty list of users again. But it would be nice to know that your system
  still works in its initial state, especially if you might need to deploy
  another instance for another customer in the future.
- If your list supports various filters, sorts or pagination, you should write
  tests for these as well.
- If a route requires authentication, test what happens without a token, or
  with a token that does not give the necessary permissions (`401` and `403`).
- Test what happens when a resource does not exist (`404`).

## Check your test coverage

The Node.js test runner can tell you which lines of your code are executed by
your tests. **Update** the `test` script in your `package.json` file to add the
[coverage options][node-test-coverage]:

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "node --env-file=.env.test --test --experimental-test-coverage --test-coverage-exclude=tests/** --test-coverage-lines=75"
}
```

- `--experimental-test-coverage` turns coverage on. (It works fine: the name
  only means that its options may still change in future versions of Node.js.)
- `--test-coverage-exclude=tests/**` leaves the files in your `tests` folder out
  of the report: you want to know how much of your **application** is tested.
- `--test-coverage-lines=75` makes `npm test` **fail** if less than 75% of the
  lines of your application are covered.

Run `npm test` again. You should see a coverage report after the test results:

```bash
$> npm test
...
ℹ start of coverage report
ℹ ------------------------------------------------------------------
ℹ file         | line % | branch % | funcs % | uncovered lines
ℹ ------------------------------------------------------------------
ℹ app.js       |  85.71 |    60.00 |   40.00 | 22 26 31-32 40 49-51
ℹ config.js    |  57.14 |    25.00 |  100.00 | 10-11 15-21
ℹ middlewares  |        |          |         |
ℹ  auth.js     |  68.00 |    50.00 |   50.00 | 9-10 19-20 22-25
ℹ models       |        |          |         |
ℹ  user.js     | 100.00 |   100.00 |  100.00 |
ℹ routes       |        |          |         |
ℹ  index.js    |  88.89 |   100.00 |    0.00 | 6
ℹ  users.js    |  67.27 |   100.00 |   66.67 | 35-52
ℹ ------------------------------------------------------------------
ℹ all files    |  76.72 |    65.00 |   50.00 |
ℹ ------------------------------------------------------------------
ℹ end of coverage report
```

- **line %** is the percentage of lines executed by at least one test.
- **branch %** is the percentage of branches (both sides of an `if`, each case
  of a `switch`…) taken by at least one test. It is usually lower than the line
  coverage, and more telling: a line with an `if` is "covered" even if only one
  of its branches is tested.
- **uncovered lines** tells you where to look for missing tests. In this
  example, lines 35-52 of `routes/users.js` are the login route, which no test
  calls yet, and lines 9-10 and 19-25 of `middlewares/auth.js` are the
  responses to a missing or invalid token.

> [!NOTE]
> A file that **no test imports** does not appear in the report at all, so your
> percentage may look better than it really is.

It is not always possible to achieve 100% coverage, but generally the higher
your coverage, the better chance you have of catching bugs or breaking changes.
Keep in mind that coverage only tells you which code was **executed**, not
whether it was **checked**: a test without any assertion still covers code.

### Optional: an HTML coverage report

The Node.js test runner only prints the report in the terminal. If you want a
browsable HTML report, install [c8][c8], which uses the same coverage data:

```bash
$> npm install --save-dev c8
```

Run it with:

```bash
$> npx c8 --reporter=html --reporter=text --exclude="tests/**" node --env-file=.env.test --test --test-concurrency=1
```

Add the following line to your `.gitignore` file:

```
/coverage
```

Then open the `coverage/index.html` file in your browser. It shows each file of
your application, with the lines that are not covered by your tests highlighted.

## Avoid problems with parallelism

Once you start writing multiple test files, you may run into parallelism issues.
Some of your tests may become
["flaky"](https://docs.gitlab.com/development/testing_guide/unhealthy_tests/#flaky-tests),
i.e. they sometimes pass, sometimes fail, due to no apparent reason.

The tests in one file run sequentially (i.e. one by one), but the Node.js test
runner [runs each test file in a separate process, and runs several of them in
parallel][node-test-execution-model].

This is a problem since we decided to wipe the database clean before every test.
This means that a test in file A might clean the database at the same time a
test in file B is executing, deleting B's test fixtures.

To avoid this problem, add [the `--test-concurrency=1` option][node-test-concurrency]
to the `test` script to run test files one at a time:

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "node --env-file=.env.test --test --test-concurrency=1 --experimental-test-coverage --test-coverage-exclude=tests/** --test-coverage-lines=75"
}
```

> Note that this will have the effect of slowing down your test suite, since
> files which were running in parallel before will now have to execute one by
> one.
>
> If you have a very large test suite in a real-world project, it may become too
> slow, and you may have to switch to another solution:
>
> - Generate random data for each test to avoid collisions instead of wiping the
>   database.
> - Use [MongoDB Memory Server][mongodb-memory-server], a package that starts a
>   separate, temporary MongoDB server in memory for each test file. Each file
>   then has its own database, so the files can run in parallel again. The
>   package downloads a MongoDB binary the first time you use it.
> - Some test frameworks provide **transactional testing**, where each test is
>   wrapped in a transaction so that it only sees its own changes. Then the
>   transaction is rolled back at the end of the test so that no changes are
>   actually persisted that can affect other tests. Frameworks such as [Ruby on
>   Rails](https://guides.rubyonrails.org/testing.html#testing-parallel-transactions)
>   or [Ecto for Elixir](https://hexdocs.pm/ecto/testing-with-ecto.html) offer
>   this feature.

## Optional: run your tests on every push

Tests that nobody runs are soon broken. **Continuous integration** (CI) runs
your tests automatically every time someone pushes to your repository, so that
you know right away when a change breaks something. With [GitHub
Actions][github-actions], it only takes one file.

> [!WARNING]
> **This consumes the GitHub Actions minutes of the owner of your
> repository.** Your project's repository is **private**, and GitHub only
> [includes a limited amount of Actions usage][github-actions-billing] for
> private repositories: about 2,000 minutes per month on Linux with a free
> account (3,000 with GitHub Pro, which the GitHub Student Developer Pack
> includes) at the time of writing. **All runs are charged to the account that
> owns the repository**, whoever pushed: every push by any member of your team
> uses the minutes of the student whose account the repository belongs to.
> Without a payment method, workflows are blocked once the included usage is
> used up. Agree with your team before you set this up, and check the usage in
> your account's billing settings.

Create a `.github/workflows/test.yml` file in your repository:

```yml
name: test

on: push

jobs:
  test:
    # Temporary: MongoDB 8 does not start on recent Ubuntu 24.04 runners.
    # https://github.com/supercharge/mongodb-github-action/issues/81
    runs-on: ubuntu-22.04
    # Stop a stuck run after 10 minutes instead of using up your minutes.
    timeout-minutes: 10

    # Start a MongoDB server for the tests.
    services:
      mongo:
        image: mongo:8.0
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 26
      - run: npm ci
      - run: npm test
```

- `on: push` runs the workflow on every push, on any branch.
- `runs-on` chooses the machine that runs the job. `ubuntu-22.04` is a
  **temporary workaround**: at the time of writing, MongoDB 8 crashes on startup
  on the more recent `ubuntu-24.04` and `ubuntu-latest` runners, because of
  [a problem with their Linux kernel][mongodb-runner-issue]. Once it is fixed,
  you can switch to `ubuntu-latest`.
- `services` starts a MongoDB server next to the job. It is reachable at
  `127.0.0.1:27017`, so your `.env.test` file works as is (this is one reason
  why it must be committed).
- `timeout-minutes` is important: by default, GitHub lets a stuck job run for
  **6 hours**. A test suite that never exits, for example because you forgot to
  disconnect from the database, would use up a large part of your minutes in a
  single run.
- The steps check out your code, install Node.js, install your dependencies
  with `npm ci` (which installs exactly what is in your `package-lock.json`
  file), and run your tests.

Commit and push the file. The result of each run appears in the **Actions** tab
of your repository, and next to each commit: a green check mark if the tests
passed, a red cross if they failed.

## Tips

- Run only some of your tests by passing [`--test-name-pattern`][node-test-name-pattern]
  to the `test` script (the `--` tells npm to pass the rest to the script):

  ```bash
  $> npm test -- --test-name-pattern="GET /users"
  ```

- Re-run your tests automatically when you save a file with
  [watch mode][node-test-watch]:

  ```bash
  $> node --env-file=.env.test --test --test-concurrency=1 --watch
  ```

- You can make negative assertions with `assert.notEqual`,
  `assert.notDeepEqual` and `assert.doesNotMatch`. See the [`node:assert`
  documentation][node-assert] for all assertions.

- If you prefer the `expect(…).toEqual(…)` style that you will see in many
  tutorials, the [`expect`][expect] package (the one used by Jest) also works
  with the Node.js test runner:

  ```js
  import { expect } from 'expect';

  expect(res.body).toEqual([]);
  ```

- If your tests pass but `npm test` never exits, something is still keeping
  your program running, usually a database connection. Make sure you call
  `mongoose.disconnect()` in an `after` hook in **every** test file. As a last
  resort, the [`--test-force-exit`][node-test-force-exit] option forces the
  process to exit once the tests are done.

> [!WARNING]
> If you use `--test-force-exit`, you are **hiding a problem, not solving it**.
> Whatever kept your process running (an open connection, a timer, a server
> that was never closed) is still there: the option only stops waiting for it.
> If it is an operation that has not finished yet, it is cut off without any
> error, and you will not notice when the same problem affects your
> application. Look for the cause first, and only use this option if you
> cannot find it.

## Documentation

- [Node.js test runner][node-test]
  - [Hooks][node-test-hooks]
  - [Code coverage][node-test-coverage]
- [`node:assert`][node-assert] (assertions)
- [SuperTest][supertest] (HTTP test library)
- [Express.js][express] (Node.js web framework)
- [Mongoose][mongoose] (Node.js object-document mapper)
- [GitHub Actions][github-actions]

**Further reading**

- [Behavior-Driven Development][bdd]
- [Test fixtures][fixture]
- [Test-Driven Development][tdd]

[async-await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[automated-testing]: https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/automated-testing?home=MediaComem%2Fcomem-archioweb%23readme
[bdd]: https://en.wikipedia.org/wiki/Behavior-driven_development
[c8]: https://github.com/bcoe/c8
[debug]: https://www.npmjs.com/package/debug
[destructuring]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring
[expect]: https://www.npmjs.com/package/expect
[express]: https://expressjs.com
[express-auth]: https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/express-auth?home=MediaComem%2Fcomem-archioweb%23readme
[express-best-practices]: https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/express-best-practices?home=MediaComem%2Fcomem-archioweb%23readme
[express-starter]: https://github.com/MediaComem/comem-archioweb/tree/main/subjects/express/starter
[fixture]: https://en.wikipedia.org/wiki/Test_fixture
[github-actions]: https://docs.github.com/en/actions/get-started/quickstart
[github-actions-billing]: https://docs.github.com/en/billing/concepts/product-billing/github-actions
[jest]: https://jestjs.io
[mocha]: https://mochajs.org
[mongo]: https://www.mongodb.com
[mongodb-memory-server]: https://typegoose.github.io/mongodb-memory-server/
[mongodb-runner-issue]: https://github.com/supercharge/mongodb-github-action/issues/81
[mongoose]: https://mongoosejs.com
[mongoose-subject]: https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/mongoose?home=MediaComem%2Fcomem-archioweb%23readme
[node]: https://nodejs.org
[node-assert]: https://nodejs.org/docs/latest-v26.x/api/assert.html
[node-env-file]: https://nodejs.org/docs/latest-v26.x/api/cli.html#--env-filefile
[node-test]: https://nodejs.org/docs/latest-v26.x/api/test.html
[node-test-concurrency]: https://nodejs.org/docs/latest-v26.x/api/cli.html#--test-concurrency
[node-test-coverage]: https://nodejs.org/docs/latest-v26.x/api/test.html#collecting-code-coverage
[node-test-execution-model]: https://nodejs.org/docs/latest-v26.x/api/test.html#test-runner-execution-model
[node-test-force-exit]: https://nodejs.org/docs/latest-v26.x/api/cli.html#--test-force-exit
[node-test-hooks]: https://nodejs.org/docs/latest-v26.x/api/test.html#beforeeachfn-options
[node-test-name-pattern]: https://nodejs.org/docs/latest-v26.x/api/test.html#filtering-tests-by-name
[node-test-watch]: https://nodejs.org/docs/latest-v26.x/api/test.html#watch-mode
[npm]: https://www.npmjs.com
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[supertest]: https://github.com/forwardemail/supertest#readme
[tdd]: https://en.wikipedia.org/wiki/Test-driven_development
[vitest]: https://vitest.dev
