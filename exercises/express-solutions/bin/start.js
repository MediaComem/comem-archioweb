#!/usr/bin/env node

import app from '../app.js';
import createDebugger from 'debug';
import http from 'http';

const debug = createDebugger('express-solutions:server');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const httpServer = http.createServer(app);

httpServer.listen(port);
httpServer.on('error', onHttpServerError);
httpServer.on('listening', onHttpServerListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onHttpServerError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onHttpServerListening() {
  const addr = httpServer.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
