# Set up automated testing for an Express.js REST API

This guide explains how to set up [automated tests][automated-testing] for an
HTTP API implemented with [Express.js][express] and [Mongoose][mongoose], using
the following tools:

* [Jest][jest] (test framework)
* [Jest Extended][jest-extended] (assertion library)
* [SuperTest] (HTTP test library)

> This is just a particular selection of popular tools. There are many other
> tools that can do the same. For example, read [this
> article][top-js-test-frameworks-2021] for a list of the most popular
> JavaScript test frameworks in 2021.
>
> Note that the code in this tutorial uses [Promises][promise] and [async
> functions][async-await]. Read [this guide](./async-js.md) if you are not
> familiar with the subject.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Requirements](#requirements)
- [Install the test framework and run your first test](#install-the-test-framework-and-run-your-first-test)
- [Your domain model & API](#your-domain-model--api)
- [Set up your test suite](#set-up-your-test-suite)
  - [Switch databases when running tests](#switch-databases-when-running-tests)
- [Write your first test](#write-your-first-test)
  - [Disconnect from the database once the tests are done](#disconnect-from-the-database-once-the-tests-are-done)
  - [Fix Mongoose `collection.ensureIndex is deprecated` warning](#fix-mongoose-collectionensureindex-is-deprecated-warning)
  - [Get rid of request logs while testing](#get-rid-of-request-logs-while-testing)
- [Add a unicity constraint to your model](#add-a-unicity-constraint-to-your-model)
- [Reproducible tests](#reproducible-tests)
- [Write more detailed assertions](#write-more-detailed-assertions)
- [Add some matchers to Jest with jest-extended](#add-some-matchers-to-jest-with-jest-extended)
- [Write a second test](#write-a-second-test)
- [Optional: authenticate](#optional-authenticate)
- [Test fixtures](#test-fixtures)
- [Am I testing every possible scenario?](#am-i-testing-every-possible-scenario)
- [Optional: check your test coverage](#optional-check-your-test-coverage)
- [Avoid problems with parallelism](#avoid-problems-with-parallelism)
- [Tip](#tip)
- [Documentation](#documentation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Requirements

* [Node.js][node] 13.2+
* You are using [npm][npm] to manage your dependencies.
* A working [Express.js][express] application providing the HTTP API you wish to
  test.
* You are using [Mongoose][mongoose] to store your data in a [MongoDB][mongo]
  database.



## Install the test framework and run your first test

Start by installing Jest, which we will use to create and run our tests:

```bash
$> npm install --save-dev jest
```

Create a `spec` folder in your project.

> `spec` is short for **specification**. When you write tests, each test will be
> identified by a short string which describes what the test is testing. For
> example, a test could be called `POST /users should create a user`. This
> **specifies** what the test is doing (`POST /users`) and what the expected
> result is `should create a user` in a brief sentence.
>
> This practice is part of [Behavior-Driven Development][bdd].

You will now create a sample test to make sure that Jest works.
Create a `spec/example.spec.js` file with the following contents:

```js
// Define a test with Jest.
test('should work', function() {
  expect(true).toEqual(true);
});
```

To run these tests, you can use the `jest` command which comes with the npm
package. The most convenient way to do it is to define a new `test` script in
the `scripts` section of your `package.json`. Unfortunately, we need to add a `--experimental-vm-modules` in order to use Jest with ES Modules.

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "node --experimental-vm-modules node_modules/.bin/jest"
}
```

>Jest will first look for files in a `__test__` directory. It will then look for files with the `*.spec.js` and `*.test.js` suffixes. As such, you shouldn't have to specify your test's location.

You can now simply run `npm test` to execute your test(s):

```bash
$> npm test

> express-api@0.0.0 test
PASS  spec/example.spec.js
  ✓ should work (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.152 s, estimated 1 s
Ran all test suites.
```

If you are on Windows and are receiving unexpected errors, try editing the Jest path in your `package.json` script:


```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
}
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
* `GET /users` lists users by ascending name.

If that is not the case, adapt the tests to your domain model and API.



## Set up your test suite

You can delete the `spec/example.spec.js` file you created earlier. Create a
`spec/users.spec.js` file instead, since we want to test the 2 user-related
routes:

```js
describe('POST /users', function() {
  test('should create a user');
});

describe('GET /users', function() {
  test('should retrieve the list of users');
});
```

> Note the nested `describe/test` structure provided by Jest. It helps you
> structure your tests when writing them. Everything that is in the
> `describe('POST /users')` block describes how that route should work. The
> `test('should create a user')` block insides describes one thing that route
> should do. Combining the two gives you the whole test specification: `POST
> /users should create a user`.

Jest allows you to write `test.todo` calls without a test function: this creates a
**pending test**, a test that is not yet implemented. If you run your tests with
`npm test` now, you should see the tests marked as `todo:

```bash
$> npm test
> express-api@0.0.0 test
PASS  spec/users.spec.js
  POST /users
    ✎ todo should create a user
  GET /users
    ✎ todo should retrieve the list of users

Test Suites: 1 passed, 1 total
Tests:       2 todo, 2 total
Snapshots:   0 total
Time:        0.156 s
Ran all test suites.
```

> You could use this functionality to prepare your test suite before writing the
> tests themselves. If you write your tests first using [Test-Driven
> Development][tdd], you could even write your whole test suite before
> implementing your API!

### Switch databases when running tests

When working on an existing application, you probably have a development
database containing some data. You don't want your tests to mess with that data.
It's good practice to **switch to a different database for testing**.

Presumably, your MongoDB connection URL is configurable through an environment
variable. For example, your `app.js` file may contain a line that looks like
this:

```js
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost/my-app', {
  // Options...
});
```

This means that you can easily switch the database URL by setting the
`$DATABASE_URL` environment variable. This is useful not only when deploying in
a production environment, but also for the test environment.

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
  "test": "cross-env LOCAL_MONGODB_URI=mongodb://localhost/my-app-test node --experimental-vm-modules node_modules/.bin/jest"
}
```

This switches the `$DATABASE_URL` variable to another value before running your
tests. In this example, it connects to the `my-app-test` database on
`127.0.0.1` (localhost) instead of the `my-app` database. That way, your tests
will modify a separate database without touching your development data.

> You could normally use `mongodb://localhost/my-app-test` for the database
> URL, but it does not seem to work on Windows for some reason.



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
import supertest from "supertest"
```

You will also import your Express.js application, which presumably is exported from the
`app.js` file at the root of your repository. Add the following line to import
it:

```js
import app from "../app.js"
```

Now you can implement your test. **Modify the `test('should create a user')`
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

> express-api@0.0.0 test
PASS  spec/users.spec.js
  POST /users
    ✓ should create a user (92 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.766 s, estimated 1 s
Ran all test suites.
```

### Disconnect from the database once the tests are done

You may notice that the `npm test` command does not exit and that you have to
stop it manually with `Ctrl-C`. This is because Mongoose is not designed to work
with tests: it is designed to stay connected to the database.

You have to tell Mongoose to disconnect after your tests are done. Import
Mongoose at the top of the file:

```js
import mongoose from "mongoose"
```

At this at the bottom of the file:

```js
afterAll(async () => {
  await mongoose.disconnect();
});
```

> Here you are using [Jest hooks][jest-hooks]. The `beforeAll` and `afterAll` global
> functions provided by Jest allow you to run code before or after your test
> suite.

### Fix Mongoose `collection.ensureIndex is deprecated` warning

If you use version 5.x of Mongoose, you may see the following warning:

```
(node:21235) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
```

To get rid of it, set the `useCreateIndex` option to true in your
`mongoose.connect` call (presumably in `app.js`):

```js
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost/my-app', {
  // <PREVIOUS OPTIONS HERE...>
  useCreateIndex: true
});
```

### Get rid of request logs while testing

You may have a request logger in your Express.js application. If you used
`generator-express-api-es`, you might see this line in the `npm test` command's output:

```
POST /users 200 93.114 ms - 52
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

Jest automatically sets our `NODE_ENV` environment variable to `test`.


## Add a unicity constraint to your model

To illustrate a problem that is often encountered with testing, you will now add
a unicity constraint to the `name` property of users.

First, you should probably remove existing users from the test database if you
have run the test more than once. Otherwise, MongoDB will not be able to create
the unique index (since there are already duplicates stored in the collection):

```bash
$> mongosh my-app-test
> db.users.deleteMany({})
{ acknowledged: true, deletedCount: 3 }
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
import User from "../models/user.js"

export const cleanUpDatabase = async function() {
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
import { cleanUpDatabase } from "./utils.js"
```

You can now call it before each test by adding this line before your `describe`
calls:

```js
beforeEach(cleanUpDatabase);
```

> You are using [Jest hooks][jest-hooks] again. The `beforeEach` and
> `afterEach` global functions provided by Jest allow you to run code before or
> after each test runs.

You should now be able to run `npm test` several times in a row without error.
Since the database is wiped every time before your test runs, it can keep
creating the same user with the same name every time.



## Write more detailed assertions

So far, your test makes a POST request on `/users` and checks that the response
has the status code 200 OK with a `Content-Type` header indicating that the
response is JSON.

That's nice, but you are not checking what is in the response body yet. With
SuperTest, the response object (`res`) has a `body` property which contains the
parsed JSON body. You can make assertions on it too.

Add the following assertions to your test after the SuperTest call chain:

```js
// Check that the response body is a JSON object with exactly the properties we expect.
expect(res.body).toEqual(
  expect.objectContaining({
    _id: expect.any(String),
    name: 'John Doe'
  })
);
```

## Add some matchers to Jest with jest-extended

Jest has [many matchers][jest-matchers]. However, as you can see, checking an
object's keys can be a bit convoluted. Fortunately, we can use the
[jest-extended][jest-extended] package to add plenty of cleaner methods to our
test suite.

Install jest-extended:

```bash
npm install --save-dev jest-extended
```

You can then setup the library by adding the following to your `package.json` file:
```json
"jest": {
  "setupFilesAfterEnv": ["jest-extended/all"]
}
```

We can now write our assertions this way:

```js
expect(res.body).toBeObject();
expect(res.body._id).toBeString();
expect(res.body.name).toEqual('John Doe');
expect(res.body).toContainAllKeys(['_id', 'name'])
```

When testing a particular API route, **you should make assertions on everything
your route does that is expected to be used by the end user**. You want to make
sure that your API works as advertised. For example: check the status code,
check important headers, check the response body.

> Note the `expect(res.body._id).toBeString()` assertion. You cannot check
> the exact value of the user's ID because you cannot know it until the user has
> been created. So you just check that it's a string. If you wanted to go
> further, you could check the exact format of that ID with
> `expect(res.body._id).toMatch(/^[0-9a-f]{24}$/)` (for MongoDB IDs).
>
> Also note the `expect(res.body).toContainAllKeys(['_id', 'name'])` assertion.
> You have an assertion to check the ID and another to check the name, but it's
> also important to check that the body does not contain other properties you
> were not expecting. That way, when you add more properties to your schema, the
> test will remind you that you should add new assertions.
>
> You may have the additional `__v` property which is a default version added by
> Mongoose for [optimistic concurrency
> control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control). If it
> makes your test fail, you can either remove it from the model's serialization,
> or modify the assertions in your test to take it into account.
>
> If you wanted to go further, you could also check that the created user has
> actually been saved to the database. There could conceivably be a bug where
> the API gives you the correct answer even though it saved something slightly
> different to the database (or did not save it at all).



## Write a second test

Let's test the application's other route. **Modify the `test('should retrieve
the list of users')` call** to add the test function. It should look like this:

```js
describe('GET /users', function() {
  test('should retrieve the list of users', async function() {

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

Make some assertions on the request body:

```js
expect(res.body).toBeArray();
expect(res.body).toHaveLengthOf(0);
```



## Optional: authenticate

If you have previously set up token-based authentication for the `GET /users`
route during this course's previous tutorials, the test will fail because the
request is not properly authenticated. You must send a valid bearer token in the
`Authorization` header.

Here's a function you will be able to use later to generate a valid token. You
can add it to `spec/utils.js`:

```js
import jwt from "jsonwebtoken"
// ...
export function generateValidJwt(user) {
  // Generate a valid JWT which expires in 7 days.
  const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
  const claims = { sub: user._id.toString(), exp: exp };
  return new Promise((resolve, reject) => {
    jwt.sign(claims, process.env.SECRET_KEY, function(err, token) {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}
```

But you need a pre-existing user in the database before you can generate a token. And the database is currently empty when the test runs since it is cleaned before each test runs.

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
attempt to retrieve the list. To create them, you will need the `User` model,
which you can import by adding this to the top of the test file:

```js
import User from "../models/user.js"
```

You now need to make sure that some users are created **before the test runs**.
You can use Jest's `beforeEach` hook. Just make sure to put it in the right
place. You want these fixtures to be created for the `GET /users` test, but not
for the `POST /users` test. You can achieve this by putting it inside the
`describe('GET /users', ...)` block: it will only apply to tests in that block.

Here's how it should look like:

```js
describe('GET /users', function() {
  let johnDoe;
  let janeDoe;
  beforeEach(async function() {
    // Create 2 users before retrieving the list.
    [ johnDoe, janeDoe ] = await Promise.all([
      User.create({ name: 'John Doe' }),
      User.create({ name: 'Jane Doe' })
    ]);
  });

  test('should retrieve the list of users', async function() {
    // ...
  });
});
```

If the `GET /users` route requires authentication, first import the `generateValidJwt` function from your `utils.js` file:

```js
import { cleanUpDatabase, generateValidJwt } from "./utils.js"
```
Then modify your request to
include a valid `Authorization` header with SuperTest's `set` method:


```js
const token = await generateValidJwt(johnDoe);
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
> express-api@0.0.0 test
 FAIL  spec/users.spec.js
  POST /users
    ✓ should create a user (121 ms)
  GET /users
    ✕ should retrieve the list of users (69 ms)

  ● GET /users › should retrieve the list of users

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 2

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        0.863 s, estimated 1 s
```

Update the assertion to fit the new data:

```js
expect(res.body).toHaveLength(2);
```

Now add some more assertions to check that the array contains exactly what you
expect:

```js
expect(res.body[0]).toBeObject();
expect(res.body[0]._id).toEqual(janeDoe.id);
expect(res.body[0].name).toEqual('Jane Doe');
expect(res.body[0]).toContainAllKeys(['_id', 'name']);

expect(res.body[1]).toBeObject();
expect(res.body[1]._id).toEqual(johnDoe.id);
expect(res.body[1].name).toEqual('John Doe');
expect(res.body[1]).toContainAllKeys(['_id', 'name']);
```

You are mainly testing 2 things here:

* As before, you are checking that the records in the database (the users in
  this case) have been correctly sent in the response with the expected
  properties.
* In addition, you are checking that the list is sorted in the correct order (by
  ascending name): `Jane Doe` must be first and `John Doe` second.



## Am I testing every possible scenario?

You now have partial coverage on these two `POST /users` and `GET /users`
routes. But the two tests you have written only cover the best case scenario:
what happens when everything goes as planned and everyone is happy.

When writing automated tests, you should attempt to cover all likely scenarios.
Here's a few examples of some tests you could add to this small project:

* If you have validations, write tests that make sure that you cannot create a
  user with invalid data. For example:
  * Attempt to create a user with an empty name, or a name that's too long.
    Check that it fails.
  * Attempt to create a user with a name that already exists (by using a test
    fixture).
* Keep the early test your wrote that checks what happens when the user list is
  empty. Once your system goes to production, it may never produce an empty list
  of users again. But it would be nice to know that your system still works in
  its initial state, especially if you might need to deploy another instance for
  another customer in the future.
* If your list supports various filters, sorts or pagination, you should write
  tests for these as well.




## Optional: check your test coverage

Jest features in integrates a test
coverage analysis tool:


**Update** the `test` script in your `package.json` to add the `--coverage` flag
right after the `jest` command:

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "cross-env DATABASE_URL=mongodb://localhost/my-app-test node --experimental-vm-modules node_modules/.bin/jest --coverage"
}
```

Add the following directories to your `.gitignore` file:

```
coverage
```

Run `npm test` again. You should see a new `coverage` directory appear. If you
open the `lcov-report/index.html` file within, you will see a report indicating which lines
of your code are covered by your automated tests, and which are not.

It is not always possible to achieve 100% coverage, but generally the higher
your coverage, the better chance you have of catching bugs or breaking changes.



## Avoid problems with parallelism

Once you start writing multiple test files, you may run into parallelism issues.
Some of your tests may become
["flaky"](https://docs.gitlab.com/ee/development/testing_guide/flaky_tests.html),
i.e. they sometimes pass, sometimes fail, due to no apparent reason.

By default, Jest runs the tests in one file sequentially (i.e. one by one), but
[it runs multiple test files in
parallel](https://freecontent.manning.com/the-value-of-concurrency-in-tests/).

This is a problem since we decided to wipe the database clean before every test.
This means that a test in file A might clean the database at the same time a
test in file B is executing, deleting B's test fixtures.

To avoid this problem, add [the `--runInBand` option][jest-run-in-band] to the
Jest command to instruct it to run all tests sequentially (i.e. one by one):

```json
"scripts": {
  "...": "<PREVIOUS SCRIPTS HERE...>",
  "test": "cross-env DATABASE_URL=mongodb://localhost/my-app-test node --experimental-vm-modules node_modules/.bin/jest --coverage --runInBand"
}
```

> Note that this will have the effect of slowing down your test suite, since
> tests which were running in parallel before will now have to execute one by
> one.
>
> In you have a very large test suite in a real-world project, it may become too
> slow, and you may have to switch to the other solution, i.e. generating random
> data for each test to avoid collisions instead of wiping the database. That
> way you can remove the `--runInBand` option and run tests in parallel again.
>
> Some test frameworks also provide an alternative solution called
> **transactional testing**, where each test is wrapped in a transaction so that
> it only sees its own changes. Then the transaction is rolled back at the end
> of the test so that no changes are actually persisted that can affect other
> tests. Frameworks such as [Ruby on
> Rails](https://guides.rubyonrails.org/testing.html#testing-parallel-transactions)
> or [Ecto for Elixir](https://hexdocs.pm/ecto/testing-with-ecto.html) offer
> this feature.



## Tip
* You can make negative assertions with `.not`:

  ```js
  expect(numberVariable).not.toBeString();
  ```



## Documentation

* [Jest][jest] (test framework)
  * [Hooks][jest-hooks]
  * [Matchers][jest-matchers]
* [Jest Extended][jest-extended]
* [SuperTest][supertest] (HTTP test library)
* [Express.js][express] (Node.js web framework)
* [Mongoose][mongoose] (Node.js object-document mapper)

**Further reading**

* [Behavior-Driven Development][bdd]
* [Test fixtures][fixture]
* [Test-Driven Development][tdd]
* [State of JS 2021: Testing ][top-js-test-frameworks-2021]





[async-await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[automated-testing]: https://mediacomem.github.io/comem-archidep/2019-2020/subjects/automated-testing/?home=MediaComem%2Fcomem-archidep%23readme#1
[bdd]: https://en.wikipedia.org/wiki/Behavior-driven_development

[cross-env]: https://www.npmjs.com/package/cross-env
[express]: https://expressjs.com
[fixture]: https://en.wikipedia.org/wiki/Test_fixture
[istanbul]: https://istanbul.js.org
[jest]: https://jestjs.io/
[jest-matchers]: https://jestjs.io/docs/expect
[jest-extended]: https://jest-extended.jestcommunity.dev/docs/matchers/
[jest-test]: https://jestjs.io/docs/api#testname-fn-timeout
[jest-hooks]: https://jestjs.io/docs/setup-teardown
[jest-run-in-band]: https://jestjs.io/docs/cli#--runinband
[mongo]: https://www.mongodb.com
[mongoose]: https://mongoosejs.com
[node]: https://nodejs.org
[npm]: https://www.npmjs.com
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[supertest]: https://github.com/visionmedia/supertest
[supertest-examples]: https://github.com/visionmedia/supertest#example
[tdd]: https://en.wikipedia.org/wiki/Test-driven_development
[top-js-test-frameworks-2021]: https://2021.stateofjs.com/en-US/libraries/testing
