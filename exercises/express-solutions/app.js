import express from 'express';
import logger from 'morgan';
import { randomUUID } from 'node:crypto';

import { env } from './config.js';
import booksRouter from './routes/books.js';
import computationsRouter from './routes/computations.js';
import helloRouter from './routes/hello.js';

const app = express();

app.use(logger(env === 'production' ? 'combined' : 'dev'));

// Bonus: identify every response with a unique ID.
app.use(function (req, res, next) {
  res.set('X-Request-Id', randomUUID());
  next();
});

// Parse JSON request bodies into req.body. Invalid JSON is forwarded to the
// error handler below as an error with status 400.
app.use(express.json());

app.use('/hello', helloRouter);
app.use('/computations', computationsRouter);
app.use('/books', booksRouter);

// No route matched: respond with 404 Not Found.
app.use(function (req, res) {
  res
    .status(404)
    .json({ message: `No route found for ${req.method} ${req.path}.` });
});

// Global error handler. Express 5 also forwards errors thrown (or promises
// rejected) by async route handlers here.
app.use(function (err, req, res, next) {
  const status = err.status ?? 500;
  if (status >= 500) {
    console.warn(err.stack);
  }

  // Do not reveal the details of unexpected errors to the client.
  const message = status < 500 ? err.message : 'An unexpected error occurred.';
  res.status(status).json({ message });
});

export default app;
