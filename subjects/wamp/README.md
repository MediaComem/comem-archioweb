# Web Application Messaging Protocol (WAMP)

WAMP is a routed protocol that provides two messaging patterns: Publish &
Subscribe and routed Remote Procedure Calls. It is intended to connect
application components in distributed applications. WAMP uses WebSocket as its
default transport, but can be transmitted via any other protocol that allows for
ordered, reliable, bi-directional, and message-oriented communications.

**You will need**

* Something

**Recommended reading**

* [WebSockets](../ws/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Routed protocol](#routed-protocol)
- [Two messaging patterns](#two-messaging-patterns)
- [Roles](#roles)
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Routed protocol

> WAMP is a routed protocol, with all components connecting to a WAMP Router,
> where the WAMP Router performs message routing between the components.

## Two messaging patterns

> WAMP provides two messaging patterns: Publish & Subscribe and routed Remote
> Procedure Calls.
>
> Publish & Subscribe (PubSub) is an established messaging pattern where a
> component, the Subscriber, informs the router that it wants to receive
> information on a topic (i.e., it subscribes to a topic). Another component, a
> Publisher, can then publish to this topic, and the router distributes events
> to all Subscribers.
>
> Routed Remote Procedure Calls (RPCs) rely on the same sort of decoupling that
> is used by the Publish & Subscribe pattern. A component, the Callee, announces
> to the router that it provides a certain procedure, identified by a procedure
> name. Other components, Callers, can then call the procedure, with the router
> invoking the procedure on the Callee, receiving the procedure's result, and
> then forwarding this result back to the Caller. Routed RPCs differ from
> traditional client-server RPCs in that the router serves as an intermediary
> between the Caller and the Callee.
>
> The decoupling in routed RPCs arises from the fact that the Caller is no
> longer required to have knowledge of the Callee; it merely needs to know the
> identifier of the procedure it wants to call. There is also no longer a need
> for a direct connection between the caller and the callee, since all traffic
> is routed. This enables the calling of procedures in components which are not
> reachable externally (e.g. on a NATted connection) but which can establish an
> outgoing connection to the WAMP router.
>
> Combining these two patterns into a single protocol allows it to be used for
> the entire messaging requirements of an application, thus reducing technology
> stack complexity, as well as networking overheads.

## Roles

* PubSub: Publisher, Subscriber, Broker
* RPC: Caller, Callee, Dealer
* Router: Broker and/or Dealer
* Client: Publisher, Subscriber, Caller and/or Callee
* Connection: between a Client and Router using a transport (WebSockets by default)
* Session: established over a Connection, joined to a Realm on a Router



## TODO

* Authentication
* Authorization