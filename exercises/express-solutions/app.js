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
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/hello', helloRouter);
app.use('/computations', computationsRouter);
app.use('/books', booksRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Global error handler
app.use(function (err, req, res, next) {
  console.warn(err.stack);

  // Send the error status
  res.sendStatus(err.status || 500);
});

export default app;
