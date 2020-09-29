# REST exercises solutions

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Make someone](#make-someone)
- [Find someone](#find-someone)
- [Bad things](#bad-things)
- [People, people everywhere](#people-people-everywhere)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Make someone

The combination of the `POST` method and `/unrest/people/create` method does not
follow the HTTP specification and is therefore not RESTful:

* `create` is a verb and should not be in the URL path. The URL in a REST API
  must identify the resource being acted upon, i.e. a thing and not an action.
  Therefore the URL should end with a noun instead of a verb.
* The `POST` method identifies the action, which is to [create a new resource as
  per the HTTP
  specification](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5).

Additionally, the response looks something like this (abridged headers):

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "age": 20,
  "id": 90715
}
```

The status code of the response should be [`201
Created`](https://httpstatuses.com/201) if a resource was created as a result of
the request, according to the HTTP specification. Additionally, it should
include a [`Location`
header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
indicating the URL of the newly created resource. This header is also missing.

A correct request may look like this:

```http
POST /unrest/people HTTP/1.1
Content-Type: application/json
Location: comem-rest-demo.herokuapp.com

{
  "firstName": "John",
  "lastName": "Doe",
  "age": 20
}
```

And a correct response may look something like this (abridged headers):

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: https://comem-rest-demo.herokuapp.com/unrest/people/90715

{
  "firstName": "John",
  "lastName": "Doe",
  "age": 20,
  "id": 90715
}
```



## Find someone

According to the HTTP specification, the [`GET`
method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3) must be
[safe](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.1.1), meaning
that it should take no action other than retrieval. Here we update a person
using the `GET` method, which is an unsafe operation. This request does not
follow the HTTP specification and is therefore not RESTful.

Additionally, URL query parameters are not appropriate for sending resource
data. The resource representation is supposed to be in the request body, with
the type of data indicated in the [`Content-Type`
header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
to support [content
negotation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation).

There are also other concerns with URL query parameters. In this example, only a
first name is sent; but for a larger resource, sending the data in the URL may
be impractical. Query parameters do not support complex structures. Also, some
web servers impose a limit on URL length which is usually much shorter than the
limit on the size of the request body.

This request should be a [`PATCH`](https://tools.ietf.org/html/rfc5789) or a
[`PUT`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6) request
with a partial (for `PATCH`) or complete (for `PUT`) resource representation
sent in the request body instead of the URL query parameters.

A correct request may look like this:

```http
PATCH /unrest/person/7 HTTP/1.1
Content-Type: application/json
Location: comem-rest-demo-herokuapp.com

{
  "firstName": "Bob"
}
```



## Bad things

The response to the first request is:

```http
HTTP/1.1 500 Internal Server Error
Content-Type: text/html

The "name" property is required
```

This indicates an error due to invalid data sent by the client. The status code
[`500 Internal Server Error`](https://httpstatuses.com/500) indicates an
unexpected error. It is in the [5xx
range](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5),
which indicates a problem caused by the server.

This code is not appropriate for this response. A validation error is not an
unexpected error; it is expected in normal operation if a client sends invalid
data. Also, the server is not at fault: the client caused the error by not
properly validating the data before sending it.

The code for this response should be one in the [4xx
range](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4),
indicating a problem caused by the client. One of the following codes seems
appropriate:

* [`400 Bad Request`](https://httpstatuses.com/400) indicates a general problem
  with the syntax of the request.
* [`422 Unprocessable Entity`](https://httpstatuses.com/422) indicates that the
  request is well-formed (e.g. the request body is valid JSON) but that the
  request body contains semantic errors (e.g. some properties are invalid
  according to the business domain).

A correct response may look something like this (abridged headers):

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: text/html

The "name" property is required
```

> Additionally, the API may want to return more structured information than a
> plain text or HTML message for programmatic use, e.g. a JSON payload including
> metadata about why a property is considered invalid.



## People, people everywhere

See [Filtering with
URLs](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/rest-advanced/?home=MediaComem%2Fcomem-archioweb%23readme#22)
and the next slide [Use URL query parameters for
filtering](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/rest-advanced/?home=MediaComem%2Fcomem-archioweb%23readme#23).

A better way to filter the collection would be to use URL query parameters:

```http
GET /unrest/people?lastName=Riggs&age=35
Location: comem-rest-demo.herokuapp.com
```
