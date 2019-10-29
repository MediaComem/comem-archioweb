# WebSockets

The WebSocket Protocol enables full-duplex two-way communication between a
client and a remote host.

**You will need**

* Something

**Recommended reading**

* [Command Line Introduction](../cli/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Real-time HTTP](#real-time-http)
  - [Request-response, half-duplex](#request-response-half-duplex)
- [What is WebSockets?](#what-is-websockets)
- [Compatible with HTTP](#compatible-with-http)
  - [Full Duplex](#full-duplex)
  - [Protocol handshake](#protocol-handshake)
  - [Message-based](#message-based)
  - [Security](#security)
  - [Framing](#framing)
  - [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Real-time HTTP

<!-- slide-front-matter class: center, middle, image-header -->

<img src='images/http.png' class='w50' />

> [RFC 6555][ws-background]: "Historically, creating web applications that need
> **bidirectional communication** between a client and a server (e.g., instant
> messaging and gaming applications) has required an **abuse of HTTP** to poll
> the server for updates while sending upstream notifications as distinct HTTP
> calls."

### HTTP is not optimized for small messages

HTTP has a lot of **communication overhead**:

* TCP handshakes are made frequently (in HTTP/1).
* TLS handshakes are optionally made for HTTPS.
* Headers are sent in each request *and* response.

<p class='center'><img src='images/tcp-tls-handshake.png' class='w80' /></p>

### Real-time request-response workarounds

HTTP is a **request-response** protocol not meant for bidirectional
communication. It is possible to obtain real-time-like behavior with HTTP/1 with
tricks such as [Comet][comet] or techniques like [Server-Sent Events
(SSE)][sse].

<p class='center'><img src='images/http-real-time.png' class='w80' /></p>

### HTTP/2 multiplexing

<!-- slide-column 65 -->

<img src='images/http2-multiplexing.png' class='w100' />

<!-- slide-column -->

[HTTP/2][http2] changes things a little by introducing [server push][http2-push]
and multiplexing.

However, the protocol is still not designed for real-time communication, as it
is still based on requests and responses with the overhead of headers.

[HTTP/2 will also support WebSockets][http2-websockets].



## What are WebSockets?

<!-- slide-front-matter class: center, middle, image-header -->

<img src='images/ws.png' class='w70' />

> [RFC 6555][ws-rfc]: "The goal of this technology is to provide a mechanism for
> browser-based applications that need **two-way communication** with servers
> that **does not rely on opening multiple HTTP connections**."

### WebSocket URL scheme

WebSocket introduces 2 new URL schemes similar to `http://` and `https://`:

* `ws://host:port/path?query` (port 80 by default)
* `wss://host:port/path?query` (port 443 by default, secured by TLS)

For example, `wss://example.com` represents a secure WebSocket endpoint on the
`example.com` server.

### Compatible with HTTP

The WebSocket protocol is designed to work over HTTP ports 80 and 443 to support
existing infrastructure (e.g. proxies, filtering, authentication).

<!-- slide-column -->

To open a WebSocket connection, the client must make an [**opening
handshake**][ws-handshake] using the [HTTP `Upgrade` header][http-upgrade]:

```http
GET /ws HTTP/1.1
Host: ws.example.com
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: dGhl...HNhb==
Sec-WebSocket-Version: 13
```

<!-- slide-column -->

Provided that the server supports WebSockets, it will respond that it is
switching protocols from HTTP to WebSocket:

```http
HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: s3pP...LBio=
```

<!-- slide-container -->

Further communication on that TCP connection is then made with the WebSocket
protocol instead of HTTP.

#### Avoiding confusion between HTTP and WebSocket

Since HTTP and WebSocket share the same port, **the server must prove to the
client that it understands the WebSocket protocol**, and is not treating the
handshake request as any other HTTP request.

The client sends a random [base64][base64]-encoded 16-bit value in the HTTP
`Sec-WebSocket-Key` header:

```
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
```

As defined by the protocol, the server must concatenate this value with the
fixed value `258EAFA5-E914-47DA-95CA-C5AB0DC85B11`:

```
dGhlIHNhbXBsZSBub25jZQ==258EAFA5-E914-47DA-95CA-C5AB0DC85B11
```

It must then send the base64-encoded [SHA-1][sha1] hash of this value to the
client in the HTTP `Sec-WebSocket-Accept` header:

```
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

> This mechanism simply exists to make sure that the server does not accept a
> random HTTP request that may look like a WebSocket handshake.

### WebSocket is full duplex

Once the handshake is done, a single TCP connection remains open and allows for
**full-duplex bidirectional communication**.

<p class='center'><img src='images/ws-diagram.png' class='w65' /></p>

### WebSocket is message-based

<!-- slide-column -->

While HTTP is a request-response protocol, WebSocket is a lower-level **message
protocol**.

Both client and server may send each other messages at any time:

* The server is not obligated to send a message back in response to a client
  message, and vice-versa.
* Once the connection is established, the server may send unsollicited messages
  to the client (e.g. for notifications).

<!-- slide-column 50 -->

<img src='images/ws-message-based.png' class='w100' />

### Security

The WebSocket protocol uses the same techniques as HTTP for security:

* The **origin model** can be used to restrict which web pages can contact a
  WebSocket server.
* Since the opening handshake is an HTTP request, the server may use HTTP
  security mechanisms to grant or deny access. For example:

  * **Session cookies**
  * **Basic or token-based authentication**

More precise authentication or authorization is the responsibility of the
application layer (just like HTTP).



## WebSocket message framing

<!-- slide-front-matter class: center, middle -->

<img src='images/ws-framing.png' class='w85' />

> Each WebSocket message consists of one or more binary [frames][ws-rfc-framing].

### Anatomy of a frame

The WebSocket Protocol is designed on the principle that there should be minimal
framing. It is intended to be as close to exposing raw TCP as possible given the
constraints of the web.

* The `FIN` bit indicates whether a frame is the final frame of a message. It is
  used to split a large message into several smaller frames to avoid network
  congestion.
* The 4-bit `opcode` determines the type of frame. There are a few **control
  frames** defined by the protocol, and there are **data frames** to send text
  or binary data.
* The `MASK` bit indicates whether the client data is [masked][ws-rfc-masking]
  with the `Masking-key`, a security measure to prevent [specific web
  infrastructure attacks][ws-rfc-masking-attack].
* The 7-bit `Payload len` indicates the length of the `Payload Data`. Depending
  on the value of those 7 bits, an extra 16 or 64 bits may be used.
* The `Payload Data` contains the text or binary data of the message.

### Opcodes

The protocol defines 2 **data frame** opcodes:

Opcode | Hex   | Description
:----- | :---- | :----------
`0001` | `0x1` | Indicates that the payload data is text data encoded as UTF-8.
`0010` | `0x2` | Indicates that the payload data is binary data to be interpreted by the application layer.

And 3 **control frame** opcodes:

Opcode | Hex   | Description
:----- | :---- | :----------
`1000` | `0x8` | Close the WebSocket connection.
`1001` | `0x9` | Send a ping (to check whether the connection is still alive).
`1010` | `0xA` | Send a pong (in response to a ping).

### Frame size

This table lists the byte size of single-frame WebSocket text messages:

Text bytes | Extra protocol bytes (`FIN`, `opcode`, etc) | Total bytes
:--------- | :------------------------------------------ | :----------
1-125      | 6                                           | 7-131
126-65535  | 8                                           | 134-65543
65536+     | 14                                          | 65550+

In constrast, this is a minimal HTTP request to send the character `A` (1 byte
of text data) from a client to a server:

```http
GET / HTTP/1.1
Host: example.com
Content-Type: text/plain

A
```

> This HTTP request is 60 bytes long (with 59 of those bytes being extra bytes
> from the HTTP protocol), and 3 round trips would probably have to be made
> before sending it (to establish a new TCP connection secured with TLS). The
> equivalent WebSocket message would be only 7 bytes long and require no
> previous round trip.



## To WebSocket or not to WebSocket?

<!-- slide-column 40 -->

**Advantages**

* Full duplex communication.
* Much more efficient for small and/or frequent messages (since there is less
  connection establishment and protocol overhead).

<!-- slide-column -->

**Disadvantages**

* No high-level semantics like request/response or publish/subscribe.
* Open TCP connections consume resources. Serving many WebSocket clients has
  [performance implications][tcp-connections-limit] for the server.
* No caching (unlike HTTP).
* No support in old clients (e.g. old versions of Internet Explorer).



## Resources

* [WebSocket][ws]
  * [The WebSocket Protocol RFC][ws-rfc]
  * [Writing WebSocket servers][ws-mdn]
  * [HTTP/2 WebSockets][http2-websockets]
* HTTP
  * [Comet][comet]
  * [Server-Sent Events (SSE)][sse]
  * [Introduction to HTTP/2][http2]
  * [HTTP/2 server push][http2-push]



## TODO

* Subprotocols:
  * https://tools.ietf.org/html/rfc6455#section-1.9
  * https://www.iana.org/assignments/websocket/websocket.xml#subprotocol-name
  * https://www.iana.org/assignments/websocket/websocket.xhtml#extension-name
* TCP guarantees order, so WebSockets does also (for one connection)



[base64]: https://en.wikipedia.org/wiki/Base64
[comet]: https://en.wikipedia.org/wiki/Comet_(programming)
[http-upgrade]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism
[http2]: https://developers.google.com/web/fundamentals/performance/http2
[http2-push]: https://www.smashingmagazine.com/2017/04/guide-http2-server-push/
[http2-websockets]: https://medium.com/@pgjones/http-2-websockets-81ae3aab36dd
[sha1]: https://en.wikipedia.org/wiki/SHA-1
[sse]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
[tcp-connections-limit]: https://stackoverflow.com/questions/2332741/what-is-the-theoretical-maximum-number-of-open-tcp-connections-that-a-modern-lin
[ws]: https://en.wikipedia.org/wiki/WebSocket
[ws-background]: https://tools.ietf.org/html/rfc6455#section-1.1
[ws-handshake]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#The_WebSocket_handshake
[ws-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers
[ws-rfc]: https://tools.ietf.org/html/rfc6455
[ws-rfc-framing]: https://tools.ietf.org/html/rfc6455#section-5.2
[ws-rfc-masking]: https://tools.ietf.org/html/rfc6455#section-5.3
[ws-rfc-masking-attack]: https://tools.ietf.org/html/rfc6455#section-10.3