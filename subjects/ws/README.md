# WebSockets

The WebSocket Protocol enables two-way communication between a client and a
remote host.

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



## What is WebSockets?

<!-- slide-front-matter class: center, middle, image-header -->

<img src='images/ws.png' class='w70' />



## Real-time HTTP

<!-- slide-column -->

> "[Historically][ws-background], creating web applications that need
> bidirectional communication between a client and a server (e.g., instant
> messaging and gaming applications) has required an abuse of HTTP to poll the
> server for updates while sending upstream notifications as distinct HTTP
> calls."

<!-- slide-column 40 -->

<img src='images/real-time.gif' class='w100' />

<!-- slide-container -->

HTTP is a **request-response** protocol which was not designed for real-time,
bidirectional communication. Achieving it requires **multiple TCP connections**
with **high overhead** (handshakes are made for each connection and headers are
sent each time).

Here are a few techniques: [Comet][comet], [Server-Sent Events (SSE)][sse].

### Request-response, half-duplex

* HTTP polling
* Comet
  * Streaming
    * Hidden iframe
    * XMLHttpRequest
  * AJAX long polling
* Server-Sent Events (SSE)

https://tools.ietf.org/html/draft-zhu-http-fullduplex-08



## What is WebSockets?

Lorem ipsum.

## Compatible with HTTP

HTTP Upgrade header.

> The WebSocket Protocol is designed to supersede existing bidirectional
> communication technologies that use HTTP as a transport layer to benefit from
> existing infrastructure (proxies, filtering, authentication).  Such
> technologies were implemented as trade-offs between efficiency and reliability
> because HTTP was not initially meant to be used for bidirectional
> communication (see [RFC6202] for further discussion).  The WebSocket Protocol
> attempts to address the goals of existing bidirectional HTTP technologies in
> the context of the existing HTTP infrastructure; as such, it is designed to
> work over HTTP ports 80 and 443 as well as to support HTTP proxies and
> intermediaries, even if this implies some complexity specific to the current
> environment.  However, the design does not limit WebSocket to HTTP, and future
> implementations could use a simpler handshake over a dedicated port without
> reinventing the entire protocol.  This last point is important because the
> traffic patterns of interactive messaging do not closely match standard HTTP
> traffic and can induce unusual loads on some components.

> The WebSocket Protocol is an independent TCP-based protocol.  Its only
> relationship to HTTP is that its handshake is interpreted by HTTP servers as
> an Upgrade request.

> By default, the WebSocket Protocol uses port 80 for regular WebSocket
> connections and port 443 for WebSocket connections tunneled over Transport
> Layer Security (TLS)

### Full Duplex

Lorem ipsum.

### Protocol handshake

https://tools.ietf.org/html/rfc6455#section-1.2
https://en.wikipedia.org/wiki/WebSocket#Protocol_handshake

### Design philosophy

> The WebSocket Protocol is designed on the principle that there should be
> minimal framing.
>
> Conceptually, WebSocket is really just a layer on top of TCP that does the
> following:
>
> * Adds a web origin-based security model for browsers.
>
> * Adds an addressing and protocol naming mechanism to support multiple
>   services on one port and multiple host names on one IP address.
>
> * Layers a framing mechanism on top of TCP to get back to the IP
>   packet mechanism that TCP is built on, but without length limits.
>
> * Includes an additional closing handshake in-band that is designed to work in
>   the presence of proxies and other intermediaries.
>
> Other than that, WebSocket adds nothing.  Basically it is intended to be as
> close to just exposing raw TCP to script as possible given the constraints of
> the Web.  It's also designed in such a way that its servers can share a port
> with HTTP servers, by having its handshake be a valid HTTP Upgrade request.
>
> https://tools.ietf.org/html/rfc6455#section-1.5

### Message-based

> Once the client and server have both sent their handshakes, and if the
> handshake was successful, then the data transfer part starts. This is a
> two-way communication channel where each side can, independently from the
> other, send data at will.

### Security

> The WebSocket Protocol uses the origin model used by web browsers to restrict
> which web pages can contact a WebSocket server when the WebSocket Protocol is
> used from a web page.  Naturally, when the WebSocket Protocol is used by a
> dedicated client directly (i.e., not from a web page through a web browser),
> the origin model is not useful, as the client can provide any arbitrary origin
> string.
>
> This protocol is intended to fail to establish a connection with servers of
> pre-existing protocols like SMTP [RFC5321] and HTTP, while allowing HTTP
> servers to opt-in to supporting this protocol if desired.  This is achieved by
> having a strict and elaborate handshake and by limiting the data that can be
> inserted into the connection before the handshake is finished (thus limiting
> how much the server can be influenced).
>
> It is similarly intended to fail to establish a connection when data from
> other protocols, especially HTTP, is sent to a WebSocket server.

### Framing

* https://tools.ietf.org/html/rfc6455#section-5.2
* https://tools.ietf.org/html/rfc6455#section-5.5

### TODO

* Efficient for small messages
* URI schemes (`ws`/`wss`), no fragments
* Subprotocols:
  * https://tools.ietf.org/html/rfc6455#section-1.9
  * https://www.iana.org/assignments/websocket/websocket.xml#subprotocol-name
  * https://www.iana.org/assignments/websocket/websocket.xhtml#extension-name
* Performance implications
  * File descriptors: https://stackoverflow.com/questions/2332741/what-is-the-theoretical-maximum-number-of-open-tcp-connections-that-a-modern-lin
* Masking (https://stackoverflow.com/questions/14174184/what-is-the-mask-in-a-websocket-frame)
* Fragmentation (https://tools.ietf.org/html/rfc6455#section-5.4)
* TCP guarantees order, so WebSockets does also (for one connection)



[comet]: https://en.wikipedia.org/wiki/Comet_(programming)
[sse]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
[ws-background]: https://tools.ietf.org/html/rfc6455#section-1.1