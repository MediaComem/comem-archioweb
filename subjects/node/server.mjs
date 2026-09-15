// Import the HTTP module.
import http from 'node:http';

// Define configuration properties.
const hostname = '127.0.0.1';
const port = 3000;

// Create an HTTP server that will respond to
// all requests with "Hello World" in plain text.
const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.on('connection', function(socket) {
  console.log(`${socket.remoteAddress} connected`);
});

server.on('request', function(message) {
  console.log(`${message.url} requested`);
});

// Run the server on the configured host and port.
// Register a callback function to be notified when
// the server has started successfully.
server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
