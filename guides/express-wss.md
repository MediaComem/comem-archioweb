# Add a WebSocket server to an Express.js application

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install a WebSocket package](#install-a-websocket-package)
- [Implement a WebSocket server](#implement-a-websocket-server)
- [Create the WebSocket server](#create-the-websocket-server)
- [Sending WebSocket messages from routes](#sending-websocket-messages-from-routes)
- [Sending WebSocket messages to specific clients](#sending-websocket-messages-to-specific-clients)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install a WebSocket package

```bash
$> npm install ws
```

## Implement a WebSocket server

You can create a file at the root of your application to handle real-time
functionality, for example `messaging.js` (but you can name it however you want,
e.g. `ws.js`, `dispatcher.js`). This is a basic skeleton to handle multiple client connections:

```js
const debug = require('debug')('my-app:messaging');
const WebSocket = require('ws');

// Array of currently connected WebSocket clients.
const clients = [];

// Create a WebSocket server using the specified HTTP server.
exports.createWebSocketServer = function(httpServer) {
  debug('Creating WebSocket server');
  const wss = new WebSocket.Server({
    server: httpServer
  });

  // Handle new client connections.
  wss.on('connection', function(ws) {
    debug('New WebSocket client connected');

    // Keep track of clients.
    clients.push(ws);

    // Listen for messages sent by clients.
    ws.on('message', message => {

      // Make sure the message is valid JSON.
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (err) {
        // Send an error message to the client with "ws" if you want...
        return debug('Invalid JSON message received from client');
      }

      // Handle the message.
      onMessageReceived(ws, parsedMessage);
    });

    // Clean up disconnected clients.
    ws.on('close', () => {
      clients.splice(clients.indexOf(ws), 1);
      debug('WebSocket client disconnected');
    });
  });
};

// Broadcast a message to all connected clients.
exports.broadcastMessage = function(message) {
  debug(`Broadcasting message to all connected clients: ${JSON.stringify(message)}`);
  // You can easily iterate over the "clients" array to send a message to all
  // connected clients.
};

function onMessageReceived(ws, message) {
  debug(`Received WebSocket message: ${JSON.stringify(message)}`);
  // Do something with message...
}
```

## Create the WebSocket server

You should import the WebSocket file in `bin/www` since that is where the HTTP
server is created. Adding the following code will plug the WebSocket server into
the HTTP server:

```js
const { createWebSocketServer } = require('../messaging');

// ...

/**
 * Create HTTP & WebSocket servers.
 */
const server = http.createServer(app); // this line is already there
createWebSocketServer(server);

// ...
```

## Sending WebSocket messages from routes

You can easily import the WebSocket file from your routes to send messages:

```js
const { broadcastMessage } = require('../messaging');

router.post('/', function(req, res, next) {
  // Do stuff...
  broadcastMessage({ hello: 'world' });
});
```

## Sending WebSocket messages to specific clients

To send a message to a specific client, you will need to store more than just
the `ws` object when a client connects. This was done, for example, in the
[WebSocket Tic-Tac-Toe
exercise](https://github.com/MediaComem/comem-archioweb-tictactoe/blob/main/WS.md#backend-create-a-tic-tac-toe-player-for-each-new-websocket-client),
by generating a player ID that can be used to reference a specific client.

If you are using JWTs, you can [authenticate the user during the WebSocket
upgrade](https://www.npmjs.com/package/ws#client-authentication). This will
allow you to map a WebSocket client to a user of your application.


