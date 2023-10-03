import express from 'express';

import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import helloRouter from './routes/hello.js';
import computationsRouter from './routes/computations.js';
import booksRouter from './routes/books.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/hello', helloRouter);
app.use('/computations', computationsRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error status
  res.status(err.status || 500);
});

export default app;
