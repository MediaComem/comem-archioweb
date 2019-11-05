# Setting up automated testing for an Express.js REST API

This tutorial explains how to set up automated tests for an HTTP API implemented
with [Express.js][express] and [Mongoose][mongoose], using the following tools:

* [Mocha][mocha] (test framework)
* [Chai][chai] (assertion library)
* [SuperTest] (HTTP test library)

> This is just a particular selection of popular tools. There are many other
> tools that can do the same. For example, read [this
> article][top-js-test-frameworks-2019] for a list of the most popular
> JavaScript test frameworks in 2019.

<!-- START doctoc -->
<!-- END doctoc -->



## Requirements

* [Node.js][node] 12.x
* You are using [npm][npm] to manage your dependencies.
* A working [Express.js][express] application providing the HTTP API you wish to
  test.
* You are using [Mongoose][mongoose] to store your data in a [MongoDB][mongo]
  database.



## Install the test framework and run your first test

Start by installing Mocha, which will run your tests, and Chai, which you will
use to make assertions:

```bash
$> npm install --save-dev mocha chai
```

Create a `spec` folder in your project.

> `spec` is short for **specification**. When you write tests, each test will be
> identified by a short string which describes what the test is testing. For
> example, a test could be called `POST /users should create a user`. This
> **specifies** what the test is doing (`POST /users`) and what the expected
> result is `should create a user` in a brief sentence.
>
> This practice is part of [Behavior-Driven Development][bdd].

You will now create a sample test to make sure that both Mocha and Chai work.
Create a `spec/example.spec.js` file with the following contents:

```js
const { expect } = require('chai');

// Define a test with Mocha.
it('should work', function() {
  // Make assertions with Chai.
  expect(true).to.equal(true);
});
```

To run these tests, you can use the `mocha` command which comes with the npm
package. The most convenient way to do it is to define a new `test` script in
the `scripts` section of your `package.json`:

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "mocha spec/**/*.spec.js"
}
```

> Running `mocha spec/**/*.spec.js` instructs Mocha to run all the files
> matching the pattern `spec/**/*.spec.js`, which means any file in the `spec`
> directory (recursively) with the extension `.spec.js`. The file you just
> created, `spec/example.spec.js`, matches this pattern.

You can now simply run `npm test` to execute your test(s):

```bash
$> npm test

> my-app@0.0.0 test /path/to/my-app
> mocha spec/**/*.spec.js

  ✓ should work
```



## Your domain model & API

The rest of this tutorial assumes that you have the following Mongoose schema:

```js
const userSchema = new Schema({
  name: String,
  password: String
});
```

And the following routes:

* `POST /users` creates a user.
* `GET /users` lists users.

If that is not the case, adapt the tests to your domain model and API.



## Set up your test suite

You can delete the `spec/example.spec.js` file you created earlier. Create a
`spec/users.spec.js` file instead, since we want to test the 2 user-related
routes:

```js
const { expect } = require('chai');

describe('POST /users', function() {
  it('should create a user');
});

describe('GET /users', function() {
  it('should retrieve the list of users');
});
```

> Note the nested `describe/it` structure provided by Mocha. It helps you
> structure your tests when writing them. Everything that is in the
> `describe('POST /users')` block describes how that route should work. The
> `it('should create a user')` block insides describes one thing that route
> should do. Combining the two gives you the whole test specification: `POST
> /users should create a user`. You can use multiple `it` blocks inside a
> `describe` block if you want.

Mocha allows you to write `it` calls without a test function: this creates a
**pending test**, a test that is not yet implemented. If you run your tests with
`npm test` now, you should see the tests marked as pending:

```bash
$> npm test
> my-app@0.0.0 test /path/to/my-app
> mocha spec/**/*.spec.js

  POST /users
    - should create a user

  GET /users
    - should retrieve the list of users

  0 passing (3ms)
  2 pending
```

> You could use this functionality to prepare your test suite before writing the
> tests themselves. If you write your tests first using [Test-Driven
> Development][tdd], you could even write your whole test suite before
> implementing your API!



## Switch databases when running tests

When working on an existing application, you probably have a development
database containing some data. You don't want your tests to mess with that data.
It's good practice to **switch to a different database for testing**.

Presumably, your MongoDB connection URL is configurable through an environment
variable. For example, your `app.js` file may contain a line that looks like
this:

```js
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/my-app', {
  // Options...
});
```

This means that you can easily switch the database URL by setting the
`$MONGODB_URI` environment variable. This is useful not only when deploying in a
production environment, but also for the test environment.

To avoid setting this variable by hand every time, you can use the [`cross-env`
package][cross-env] which sets environment variables in a
cross-platform-compatible way. Install it:

```bash
$> npm install --save-dev cross-env
```

You can now **update** the `test` script in your `package.json` file to look
like this:

```json
"scripts": {
  "test": "cross-env MONGODB_URI=mongodb://localhost/my-app-test mocha spec/**/*.spec.js"
}
```

This switches the `$MONGODB_URI` variable to another value before running your
tests. In this example, it connects to the `my-app-test` database on `localhost`
instead of the `my-app` database. That way, your tests will modify a separate
database without touching your development data.



## Write your first test

Let's write the test to create a user (`POST /users should create a user`).
You will need to make an HTTP POST request. [SuperTest][supertest] is an HTTP
test library which is designed to test Node.js HTTP servers. You can install it
with npm:

```bash
$> npm install --save-dev supertest
```

Import it into the `spec/users.spec.js` file by adding the following line at the
top:

```js
const supertest = require('supertest');
```

You will also your Express.js application, which presumably is exported from the
`app.js` file at the root of your repository. Add the following line to import
it:

```js
const app = require('../app');
```

Now you can implement your test. **Modify the `it('should create a user')`
call** to add the test function. It should look like this:

```js
describe('POST /users', function() {
  it('should create a user', async function() {

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
  .expect(200)
  .expect('Content-Type', /json/);
```

SuperTest uses chained calls to let you build your HTTP call step by step. You
first call `supertest(app)` to give your app to the SuperTest client, then use
its various chainable methods:

* `.post('/path')` makes a POST request (or `.get` for a GET request, `.patch`
  for a PATCH request, etc).
* `.send(body)` lets you set the request body. It is serialized as JSON by
  default.
* `.expect(number)` is an **assertion**. It lets you specify which status code
  you expect the response to have. If your API responds with a different status
  code, an error will be thrown indicating that there was a problem.
* `.expect('header', value)` lets you specify the value you expect a specific
  header to have in the response. In this case, you expect your API to send back
  JSON in the response (the regular expression `/json/` matches any string that
  contains the word `json`, like `application/json`).

> Check the [SuperTest documentation][supertest-examples] for more examples and
> information on the various methods.

If you run `npm test` now, you should see something like this:

```bash
$> npm test

> my-app@0.0.0 test /path/to/my-app
> mocha spec/**/*.spec.js

  POST /users
POST /users 200 93.114 ms - 52
    ✓ should create a user (109ms)

  GET /users
    - should retrieve the list of users

  1 passing (115ms)
  1 pending
```

### Disconnect from the database once the tests are done

You may notice that the `npm test` command does not exit and that you have to
stop it manually with `Ctrl-C`. This is because Mongoose is not designed to work
with tests: it is designed to stay connected to the database.

You have to tell Mongoose to disconnect after your tests are done. Import
Mongoose at the top of the file:

```js
const mongoose = require('mongoose');
```

At this at the bottom of the file:

```js
after(mongoose.disconnect);
```

> Here you are using [Mocha hooks][mocha-hooks]. The `before` and `after` global
> functions provided by Mocha allow you to run code before or after your test
> suite.

### Fix Mongoose `collection.ensureIndex is deprecated` warning

If you use version 5.x of Mongoose, you may see the following warning:

```
(node:21235) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
```

To get rid of it, set the `useCreateIndex` option to true in your
`mongoose.connect` call (presumably in `app.js`):

```js
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/my-app', {
  // <PREVIOUS OPTIONS HERE...>
  useCreateIndex: true
});
```

### Get rid of request logs while testing

You may have a request logger in your Express.js application. If you used
`express-generator`, you might see this line in the `npm test` command's output:

```
POST /users 200 93.114 ms - 52
```

It is because of this line in `app.js` (for `express-generator` apps):

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

Setting this environment variable when running your tests now gets rid of the
request logs:

```bash
$> NODE_ENV=test npm test

> my-app@0.0.0 test /path/to/my-app
> mocha spec/**/*.spec.js

  POST /users
    ✓ should create a user (109ms)

  GET /users
    - should retrieve the list of users

  1 passing (115ms)
  1 pending
```

To avoid setting this variable every time, you can use `cross-env` again.
**Update** the `test` script in your `package.json` file to look like this:

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "cross-env MONGODB_URI=mongodb://localhost/my-app-test NODE_ENV=test mocha spec/**/*.spec.js"
}
```



## Add a unicity constraint to your model

To illustrate a problem that is often encountered with testing, you will now add
a unicity constraint to the `name` property of users.

First, you should probably remove existing users from the test database if you
have run the test more than once. Otherwise, MongoDB will not be able to create
the unique index (since there are already duplicates stored in the collection):

```bash
$> mongo my-app-test
> db.users.remove({})
WriteResult({ "nRemoved" : 3 })
```

Now **update** the schema to look like this (add a `unique` constraint to the
`name` property):

```js
const userSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  password: String
});
```

Run `npm test` once. It should work, since there are no users in the database.
Run it a second time, and it will fail because it is trying to insert the same
user again.

Your test changes behavior depending on the state of the database.



## Reproducible tests

Your automated tests should always behave the same way. In other words, they
should be **reproducible**. There are generally 2 solutions to achieve this:

* Make sure that the **initial state is always the same** when the test runs
  (e.g. the state of the database).
* Or, make sure that the test **uses different (probably random) data every
  time** to avoid collisions, especially when it comes to unicity constraints.

Which solution is best is debatable. In this tutorial, we will use the first
one: you will make sure that when each test runs, the state of the database is
always the same.

The simplest way to do that is to **wipe the database clean before each test**.
This ensures that any test will alway starts with the same state: nothing.

Create a new `spec/utils.js` file with the following function:

```js
const User = require('../models/user');

exports.cleanUpDatabase = async function() {
  await Promise.all([
    User.deleteMany()
  ]);
};
```

> This new `cleanUpDatabase` function uses your Mongoose model to delete all
> entries. You could add more `deleteMany` calls for other models to the
> `Promise.all([])` array to delete other collections in parallel.

Import this new function at the top of the `spec/users.spec.js` file:

```js
const { cleanUpDatabase } = require('./utils');
```

You can now call it before each test by adding this line before your `describe`
calls:

```js
beforeEach(cleanUpDatabase);
```

> You are using [Mocha hooks][mocha-hooks] again. The `beforeEach` and
> `afterEach` global functions provided by Mocha allow you to run code before or
> after each test runs.

You should now be able to run `npm test` several times in a row without error.
Since the database is wiped every time before your test runs, it can keep
creating the same user with the same name every time.



## Optional: check your test coverage

Install [nyc][nyc], the command line interface for [Istanbul][istanbul], a test
coverage analysis tool:

```bash
$> npm install --save-dev nyc
```

**Update** the `test` script in your `package.json` to add `nyc --reporter=html`
right before the `mocha` command:

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "cross-env MONGODB_URI=mongodb://localhost/my-app-test NODE_ENV=test nyc --reporter=html mocha spec/**/*.spec.js"
}
```

Add the following directories to your `.gitignore` file:

```
/.nyc_output
/coverage
```

Run `npm test` again. You should see a new `coverage` directory appear. If you
open the `index.html` file within, you will see a report indicating which lines
of your code are covered by your automated tests, and which are not.

It is not always possible to achieve 100% coverage, but generally the higher
your coverage, the better chance you have of catching bugs or breaking changes.



[bdd]: https://en.wikipedia.org/wiki/Behavior-driven_development
[chai]: https://www.chaijs.com
[chai-bdd]: https://www.chaijs.com/api/bdd/
[cross-env]: https://www.npmjs.com/package/cross-env
[express]: https://expressjs.com
[fixture]: https://en.wikipedia.org/wiki/Test_fixture
[istanbul]: https://istanbul.js.org
[mocha]: https://mochajs.org
[mocha-hooks]: https://mochajs.org/index.html#hooks
[mongo]: https://www.mongodb.com
[mongoose]: https://mongoosejs.com
[node]: https://nodejs.org
[npm]: https://www.npmjs.com
[nyc]: https://github.com/istanbuljs/nyc
[supertest]: https://github.com/visionmedia/supertest
[supertest-examples]: https://github.com/visionmedia/supertest#example
[tdd]: https://en.wikipedia.org/wiki/Test-driven_development
[top-js-test-frameworks-2019]: https://blog.bitsrc.io/top-javascript-testing-frameworks-in-demand-for-2019-90c76e7777e9