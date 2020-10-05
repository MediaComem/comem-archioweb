const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const booksRouter = require('./routes/books');
const computationsRouter = require('./routes/computations');
const helloRouter = require('./routes/hello');
const indexRouter = require('./routes/index');

const app = express();

// Set up view engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Warning: all routers are plugged at the root of the URL structure. Be sure to
// avoid defining duplicate paths in routers.
app.use('/', indexRouter);
app.use('/', booksRouter);
app.use('/', computationsRouter);
app.use('/', helloRouter);

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
  next(createError(404));
});

// Handle errors globally.
app.use(function(err, req, res, next) {

  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page.
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
