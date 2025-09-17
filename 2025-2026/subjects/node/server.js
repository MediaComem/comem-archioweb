const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.on('connection', function(socket) {
  console.log(socket.remoteAddress + ' connected');
});

server.on('request', function(message) {
  console.log(message.url + ' requested');
});

server.listen(port, hostname, function() {
  console.log('Server running at http://' + hostname + ':' + port + '/');
});
