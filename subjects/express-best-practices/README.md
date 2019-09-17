# Express Best Practices

Learn best development practices for [Express][express] web applications.

**You will need**

* A working [Express][express] application

**Recommended reading**

* [Express](../express/)
* [Mongoose](../mongoose/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Use routers](#use-routers)
- [Avoiding repetition with middleware](#avoiding-repetition-with-middleware)
  - [Writing middleware functions for common tasks](#writing-middleware-functions-for-common-tasks)
  - [Plugging your middleware function into routes](#plugging-your-middleware-function-into-routes)
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Use routers

**Do NOT** define all your routes in `app.js`; it will get **too large and hard to maintain**.
Group your API routes **by feature** and create a router for each group in the `routes` directory,
then `require()` them in `app.js`:

```js
const express = require('express');

const `peopleApiRouter` = require('./routes/people');
const `moviesApiRouter` = require('./routes/movies');

const app = express();

// Basic middlewares configuration here (e.g. bodyParser, static)...

app.use('/api/people', `peopleApiRouter`);
app.use('/api/movies', `moviesApiRouter`);
```



## Avoiding repetition with middleware

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

* Express conventions: use environment variables for configuration
* Express conventions: debug with prefix



[express]: https://expressjs.com
[mongoose]: http://mongoosejs.com
