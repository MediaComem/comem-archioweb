# Express Best Practices

Learn best development practices for [Express][express] web applications.

**You will need**

* A working [Express][express] application

**Recommended reading**

* [Express](../express/)
* [Mongoose](../mongoose/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Use environment variables for configuration](#use-environment-variables-for-configuration)
  - [Running your application with environment variables](#running-your-application-with-environment-variables)
  - [Create a configuration file if you have many variables](#create-a-configuration-file-if-you-have-many-variables)
  - [Validate complex configuration variables](#validate-complex-configuration-variables)
  - [The `dotenv` package](#the-dotenv-package)
    - [Installing and using `dotenv`](#installing-and-using-dotenv)
- [The `debug` package](#the-debug-package)
  - [Enabling debug logs](#enabling-debug-logs)
  - [More powerful logging](#more-powerful-logging)
- [Use routers](#use-routers)
- [Avoid repetition with middleware](#avoid-repetition-with-middleware)
  - [Writing middleware functions for common tasks](#writing-middleware-functions-for-common-tasks)
  - [Plugging your middleware function into routes](#plugging-your-middleware-function-into-routes)
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Use environment variables for configuration

Never hardcode configuration into your application, as it makes it difficult to
deploy in different environments. You may also uninentionally expose sensitive
data such as secret keys.

[Environment variables][node-process-env] are a suitable alternative. There is
already an example in a freshly generated Express application in the `bin/start.js`
file:

```js
const port = process.env.PORT || 3000;
```

That line is equivalent to the following code:

```js
let port;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 3000;
}
```

### Running your application with environment variables

Assuming this is the command to run your application:

```bash
$> npm start
```

In a Bash shell, you can prefix it with any environment variable(s) you may want
to set:

```bash
$> PORT=4000 FOO=bar npm start
```

You can also set them with `export` for the remainder of your Bash session,
before running your application:

```bash
$> export PORT=4000
$> export FOO=bar
$> npm start
```

> On a server or in a cloud environment, you want to edit the process manager's
> or cloud platform's configuration for your application. For example, on
> [Render][render], you can configure environment variables in your application's
> settings web page.

### Create a configuration file if you have many variables

If you use many environment variables for configuration, you may want to
centralize your configuration code in a single file, for example `config.js`:

```js
// File: config.js
export const port = process.env.PORT || 3000;
export const secretKey = process.env.MY_APP_SECRET_KEY || 'changeme';
```

This avoids repetition if you use the same variable in different places, and
serves as a sort of documentation of all your configuration parameters and their
default values. You can simply require this file and use its variables where
needed:

```js
// File: some other file
import * as config from '../path/to/config.js';
server.listen(config.port);
```

### Validate complex configuration variables

You always get a string value (or undefined) when you retrieve an environment
variable. No check is performed for you. Some of your configuration parameters
may be mandatory. Some probably need to be a specific kind of value like a
positive integer or an URL.

If you have a centralized configuration file like suggested earlier, you can
simply add some **validation** code and throw errors in case the values are not
as expected:

```js
// Validate that port is a positive integer.
if (process.env.PORT) {
  const parsedPort = parseInt(process.env.PORT, 10);
  if (!Number.isInteger(parsedPort)) {
    throw new Error('Environment variable $PORT must be an integer');
  } else if (parsedPort < 1 || parsedPort > 65535) {
    throw new Error('Environment variable $PORT must be a valid port number');
  }
}

// Validate that some environment variable is set.
if (!process.env.MY_APP_FOO) {
  throw new Error('Environment variable $MY_APP_FOO must be set');
}
```

### The `dotenv` package

If you use many environment variables for configuration, it can be a pain to set
them all when starting your application for local development.
[`dotenv`][dotenv] is a popular npm package that can **auto-fill your project's
environment variables from a configuration file** named `.env` with the
following format:

```
PORT=4000
MY_APP_SECRET=letmein
```

To use it, the first thing you should do it **ignore this `.env` file**, as you
don't want to unintentionally commit sensitive information into your repository:

```bash
$> echo .env >> .gitignore
$> git add .gitignore
$> git commit -m "Ignore .env file"
```

> You can share this `.env` file among your team members, and everyone can adapt
> it to their local environment if necessary. But never commit it.

#### Installing and using `dotenv`

Install `dotenv` as a development dependency:

```bash
npm install --save-dev dotenv
```

Then add the following code to the top of your configuration file (or wherever
you retrieve configuration from environment variables):

```js
// Load environment variables from the .env file.
* import * as dotenv from 'dotenv'
* dotenv.config()

// Retrieve configuration from environment variables.
const port = process.env.PORT || 3000;
// ...
```

> Make sure that you execute the `dotenv.config()` line **before
> accessing any environment variable in `process.env`**, otherwise it will be
> too late. You'll be fine if you use a centralized configuration file and put
> that code at the top.



## The `debug` package

The [`debug` package][debug] is a popular tool for debugging in Node.js
applications, which you may use instead of `console.log`. It is included in most
generated Express applications by default.

The idea is that you create a named debug logger which you can then use to log
debug messages as things happen in your application:

```js
import debug from 'debug';
const log = debug('app:movies');

log('Creating movie');
log('Successfully created movie');
log('Something happened');
```

These are **debug logs**, meaning that they **are not displayed by default**.
They are meant to be enabled when you want to debug the behavior of your
application in more details.

### Enabling debug logs

The `debug` package decides whether to actually display message depending on the
value of the `$DEBUG` environment variable.

You can enable all debug logs by setting it to `*`:

```bash
$> DEBUG=* npm start
```

Keep in mind that `debug` is a popular package and is not specific to Express.
Other packages in your dependency tree might be using it (e.g. Express does).

To only display a subset of the logs, you can specify a prefix:

```bash
$> DEBUG=app:* npm start
```

> This would display the logs from all debug loggers that have a name starting
> with `app:`. You may use this to differentiate logs within your application,
> e.g. `app:database`, `app:http`, `app:api`, etc.

### More powerful logging

The `debug` package is a minimalistic logging solution. For more features, use a
more advanced library such as:

* [bunyan]
* [log4js]
* [nightingale]
* [winston]



## Use routers

**Do NOT** define all your routes in `app.js`; it will get **too large and hard to maintain**.
Group your API routes **by feature** and create a router for each group in the `routes` directory,
then `import` them in `app.js`:

```js
import express from 'express';

import `peopleApiRouter` from './routes/people';
import `moviesApiRouter` from './routes/movies';

const app = express();

// Basic middlewares configuration here (e.g. bodyParser, static)...

app.use('/api/people', `peopleApiRouter`);
app.use('/api/movies', `moviesApiRouter`);
```



## Avoid repetition with middleware

You often end up with **code duplication in routes**:


```js
router.get('/:id', function(req, res, next) {
* Person.findById(req.params.id).exec(function(err, person) {
*   if (err) { return next(err); }
*   else if (!person) { return res.sendStatus(404); }
    // Send person here...
* });
});

router.patch('/:id', function(req, res, next) {
* Person.findById(req.params.id).exec(function(err, person) {
*   if (err) { return next(err); }
*   else if (!person) { return res.sendStatus(404); }
    // Update & send person here...
* });
});

router.delete('/:id', function(req, res, next) {
* Person.findById(req.params.id).exec(function(err, person) {
*   if (err) { return next(err); }
*   else if (!person) { return res.sendStatus(404); }
    // Delete person here...
* });
});
```

### Writing middleware functions for common tasks

You can write a **middleware function** that performs only this task and **attaches the Person document to the `req` object**:

```js
function loadPersonFromParams(req, res, next) {
  Person.findById(req.params.id).exec(function(err, person) {
    if (err) {
      return next(err);
    } else if (!person) {
      return res.status(404).send('No person found with ID ' + req.params.id);
    }

*   req.person = person;
*   next();
  });
}
```

### Plugging your middleware function into routes

You can plug this function into the routes that need it.
Your handler functions can then simply use `req.person`, as it will have been **loaded before they are executed**:

```js
router.get('/:id', `loadPersonFromParams`, function(req, res, next) {
 res.send(`req.person`);
});

router.patch('/:id', `loadPersonFromParams`, function(req, res, next) {
  // Update req.person here...
  `req.person`.save(function(err, updatedPerson) {
    if (err) { return next(err); }
    res.send(updatedPerson);
  });
});

router.delete('/:id', `loadPersonFromParams`, function(req, res, next) {
  `req.person`.remove(function(err) {
    if (err) { return next(err); }
    res.sendStatus(204);
  });
});
```



## TODO

* Express conventions: separate routes & controllers



[bunyan]: https://github.com/trentm/node-bunyan
[debug]: https://www.npmjs.com/package/debug
[dotenv]: https://www.npmjs.com/package/dotenv
[express]: https://expressjs.com
[render]: https://render.com/docs/configure-environment-variables#configuring-secrets-and-other-environment-information-on-render
[log4js]: https://www.npmjs.com/package/log4js
[mongoose]: http://mongoosejs.com
[nightingale]: https://www.npmjs.com/package/nightingale
[node-process-env]: https://nodejs.org/docs/latest-v12.x/api/process.html#process_process_env
[winston]: https://www.npmjs.com/package/winston
