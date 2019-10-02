# REST In Depth

Learn about more advanced [REST][rest] concepts like [HATEOAS][hateoas], and the
various ways REST APIs are implemented in the wild, from "practical REST" to
"true REST".

**Recommended reading**

* [REST introduction & HTTP](../rest/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Richardson Maturity Model

<!-- slide-front-matter class: center, middle, image-header -->

<img src='images/richardson-maturity-model.png' class='w90' />



### How RESTful is my API?

<!-- slide-column -->

The technologies of the World Wide Web form an amazing **technology stack** you
can pick from when developing your REST API. However, not everyone understands
all of these technologies or how to use them to their fullest potential.

<!-- slide-column 60 -->

<img src='images/richardson-maturity-model-small.png' class='w100' />

<!-- slide-container -->

The [REST maturity model developed by Leonard Richardson][rest-maturity] splits
the web technologies used to develop REST APIs into a stack with 4 levels.



### REST maturity level

Web developers tend to pick technologies from the bottom of the stack:

<p class='center'><img src='images/richardson-maturity-model-no-title.png' class='w85' /></p>

If you use none of these technologies, you are at level 0 and your API cannot be
called REST. The more web technologies you use, the greater your "REST maturity
level".



### "Not really REST" APIs - Levels 0 & 1

<!-- slide-column -->

**Level 0**

One URI, one HTTP method. For example: XML-RPC and most SOAP services.

This looks more like a library of functions than a web service. It's a huge
**black box** with a single web-based peephole.

Definitely not REST: the whole service consists of one overly complex resource.

Examples: XML-RPC or SOAP big web services.

<!-- slide-column -->

**Level 1**

Many URIs, one HTTP method.

The web service has been **split into separate components** that each get their
own URI, which makes it much easier to understand.

It's a bit more RESTful, but not really there yet. This web service deals more
with **actions rather than resources**.

Real-world example: [Flickr API][flickr-api].



### "Practical REST" APIs - Level 2

HTTP introduces [standardized methods][http-methods] (or verbs):

Method   | Description
:------- | :-------------------------------------------
`GET`    | Retrieve a resource at an URL.
`POST`   | Create a new resource subordinate to an URL.
`PUT`    | Replace (modify) the resource at an URL.
`PATCH`  | Partially modify a resource at an URL.
`DELETE` | Delete the resource identified by an URL.

You do not have to reinvent the wheel for the most common operations on
resources: creating, reading, updating and deleting ([CRUD][crud]).

For example, `GET` has a [specific meaning][http-get]: it retrieves information,
it must be [safe][http-safe] and [idempotent][http-idempotence], etc. **Where
there are constraints there are optimizations**: [caching][http-cache],
[conditional requests][http-conditional], [partial requests][http-partial] etc.

Real-world examples: [AWS Simple Storage Service (S3)
API][s3-api], [Twitter API][twitter-api].



### "True REST" hypermedia APIs - Level 3

An API is not fully REST in the strictest sense if it does not use [**Hypermedia
as the Engine of Application State (HATEOAS)**][hateoas]. This is what
distinguishes REST from other architectures and what makes a "true REST" API.

The basic principle of HATEOAS is that **the client interacts with the server
dynamically through [hypermedia][hypermedia]**. Since the World Wide Web
exhibits properties of the REST architecture, let's take a look at HTML:

```html
<html><body>
  <h1>My Awesome Website</h1>
  <p>Welcome, visitor!</p>
  <ul>
    <li><a href='/about'>Learn more about me</a></li>
    <li><a href='https://amazon.com?affiliate=me'>Buy some stuff</a></li>
  </ul>
  <form action='/login' method='POST'>
    <input name='username' type='text' / >
  </form>
&lt;/body&gt;</html>
```

HTML is hypermedia. **Why?** Think about the following question: what drives the
user's interaction through the various pages of a website? How does he or she
navigate?

#### Hypermedia

An HTML page provided by a server, such as a web page, contains 2 kinds of
hypermedia: [hyperlinks][hyperlink] and [forms][html-form]:

* **Hyperlinks** tell the client **where other resources are**.
* **Forms** tell the client **what it can do to the resources**.

To use a website, the client (i.e. the browser) only needs to:

* Know the entry point (e.g. `http://example.com`).
* Understand the HTML format (the `text/html` [media type][media-type]): not
  only how to display it, but also that it contains `<a>` tags that can be
  followed, and `<form>` tags that describe how to modify data.

**The client does not need to (and should not) know the entire structure of your
website** (i.e. all your URLs) in advance.

When a server sends you HTML, it is not only sending you data to display, it is
also sending you hypermedia: the relations between the current resource and
other resources. Those **relations are as important as the data itself** to the
functioning of the website.

#### Hyperlinks in HTTP

[RFC 8288 (Web Linking)][web-linking] defines a new `Link` HTTP header which can
be included in non-HTML responses to provide links to other resources:

```http
HTTP/1.1 200 OK
Content-Type: application/json
*Link: <http://example.com/TheBook/chapter2>; rel="prev"; title="previous chapter",
*     <http://example.com/TheBook/chapter4>; rel="next"; title="next chapter"

{ "title": "Once Upon A Time", "contents": "Lorem ipsum..." }
```

Using this header, the server can tell the client where to find related
resources, without the client having to know how to build these URLs.

Each link has a **relation** (like `prev` for the first link above), indicating
what the link represents in relation to the current resource.

[Common link relations][iana-link-relations] are standardized and managed by
[IANA][iana]. For example, the relations `first`, `prev`, `next` and `last` are
reserved for pagination in collections.

#### The OPTIONS method in HTTP

The [`OPTIONS` method][http-options] is another method like `GET` or `POST`. It
can be used by the client to ask the server what are the communication options
of a given resource:

```http
OPTIONS /api/people/123 HTTP/1.1
```

This could be a response to that request:

```http
HTTP/1.1 204 No Content
Allow: OPTIONS, GET, HEAD, PUT
```

Using the [`Allow` header][http-allow], the server is telling the client: you
can also use the methods `GET`, `HEAD` and `PUT` on this resource. Since those
methods have a standard meaning the client can deduce, for example, that this
resource **can be modified** (because you can use the `PUT` method).

> This is an example of the server telling the client how a resource can be
> modified, similarly to forms in HTML.

#### Hyperlinks in REST APIs

There are hypermedia formats similar to HTML but meant for APIs:

* [Collection+JSON][collection-json]
* [Hypertext Application Language (HAL)][hal] - [(Draft RFC)][hal-rfc]
* [JSON for Linking Data (JSON-LD)][json-ld] - [(W3C Spec)][json-ld-spec] - based on the [Resource Description Framework (RDF)][rdf]
* [JSON Hyper-Schema (RFC Draft)][json-hyper-schema]
* [Siren][siren]

For example, HAL+JSON defines a standard way of representing hyperlinks in JSON
(it also uses the standard IANA link relations):

```json
{
* "_links": {
*   "self": {
*     "href": "http://example.com/api/book/hal-cookbook"
*   }
* },
  "id": "hal-cookbook",
  "name": "HAL Cookbook"
}
```

#### Custom Hypermedia Type

You may also define your own custom media type, also known as a [vendor-specific
media type][vnd-media-type].

For example, instead of using raw JSON, you can create a
`vnd.my-awesome-website+json` media type. The `+json` suffix indicates that your
media type is an augmentation of the basic JSON media type with additional
rules.

It's up to you to define what these rules are. For example, you could write the
following in your documentation:

> All JSON properties ending with `_link` represent a hyperlink to a related
> resource:

```json
{
  "first_name": "John",
  "last_name": "Doe",
* "address_link": "https://example.com/api/people/jdoe/address
}
```

You could even [officially register your media type at IANA][iana-media-types].

#### To HATEOAS or not to HATEOAS?

<!-- slide-column -->

**Advantages:**

Clients can follow link relations in your API instead of hardcoding URLs. This
**reduces the coupling between client and server**. The server may refactor the
URL structure at will, and influence the client by including/omitting links.

Using a standardized hypermedia format **makes your API browsable** by both
humans and automated tools (e.g. [HAL browser][hal-browser]). If the format is
widely used, existing clients may even be able to manipulate your data out of
the box.

<!-- slide-column -->

**Disadvantages:**

There is no free lunch. It requires **more work** to implement a level 3 REST
API. **Clients must follow the hyperlinks** between resources instead of
accessing hardcoded URLs directly, or all the benefits of hypermedia are lost.

There is **no clear standard** in the industry when it comes to choosing your
hypermedia format.

Hypermedia is not a silver bullet: clients must still know your domain.

<!-- slide-container -->

Real-world examples: [GitHub v3 API (custom media type)][github-api], [Foxy REST
API (HAL+JSON)][foxy-api].



## Resources

**Real-world APIs**

* Level 1 REST API: [Flickr API][flickr-api]
* Level 2 REST APIs: [AWS S3 API][s3-api], [Twitter REST API][twitter-api]
* Level 3 REST APIs: [GitHub v3 API][github-api], [Foxy Hypermedia API][foxy-api]

**Further reading**

* [Architectural Styles and the Design of Network-based Software Architectures (Roy Fielding)][roy-fielding-thesis]
* [The Maturity Heuristic (Leonard Richardson)][rest-maturity]
  * [Richardson Maturity Model (Martin Fowler)][rest-maturity-fowler]
  * [4 Maturity Levels Of REST API Design (Guy Levin)][rest-maturity-levin]
* [How to GET a Cup of Coffee][get-coffee]
* [Standards.REST: don't reinvent the wheel, use fantastic wheels][rest-standards]
* [Best Practices for Designing a Pragmatic RESTful API][pragmatic-rest]
* [REST with Hypermedia - Hot or Not?][rest-with-hypermedia]



## Alternatives to REST

[REST][rest] is a well-defined architectural style and industry standard that
confers useful properties to your API if followed: performance, scalability, a
uniform interface, portability, evolvability, etc. However, it also come with
constraints. REST might not always be the best fit for all use cases.

> "If all you have is a hammer, everything starts to look like a nail."

**Alternatives**

* Plain old RPC: [gRPC][grpc]
* Newcomer: [GraphQL][graphql] (see the [Facebook API][facebook-api])
* Microservices messaging for complex distributed applications: [Apache Kafka][kafka], [RabbitMQ][rabbitmq], [WAMP][wamp]

**Further reading**

* [Is REST still a relevant API style?][rest-still-relevant]
* [Microservices messaging: why REST isn't always the best choice][microservices-messaging]



[collection-json]: https://github.com/collection-json/spec
[crud]: https://en.wikipedia.org/wiki/Create,_read,_update_and_delete
[facebook-api]: https://developers.facebook.com/docs/graph-api/
[flickr-api]: https://www.flickr.com/services/api/
[foxy-api]: https://api.foxycart.com/docs
[get-coffee]: https://www.infoq.com/articles/webber-rest-workflow/
[github-api]: https://developer.github.com/v3/
[graphql]: https://graphql.org
[grpc]: https://grpc.io
[hal]: https://en.wikipedia.org/wiki/Hypertext_Application_Language
[hal-browser]: https://github.com/mikekelly/hal-browser
[hal-rfc]: https://tools.ietf.org/html/draft-kelly-json-hal-08
[hateoas]: https://en.wikipedia.org/wiki/HATEOAS
[html-form]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
[http-allow]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow
[http-cache]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
[http-conditional]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests
[http-get]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET
[http-idempotence]: https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
[http-methods]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
[http-options]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
[http-partial]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
[http-safe]: https://developer.mozilla.org/en-US/docs/Glossary/Safe
[hypermedia]: https://en.wikipedia.org/wiki/Hypermedia
[hyperlink]: https://en.wikipedia.org/wiki/Hyperlink
[iana]: https://www.iana.org
[iana-link-relations]: https://www.iana.org/assignments/link-relations/link-relations.xhtml
[iana-media-types]: https://www.iana.org/assignments/media-types/media-types.xhtml
[json-hyper-schema]: https://json-schema.org/latest/json-schema-hypermedia.html
[json-ld]: https://json-ld.org
[json-ld-spec]: https://www.w3.org/2018/jsonld-cg-reports/json-ld/
[kafka]: https://kafka.apache.org
[media-type]: https://en.wikipedia.org/wiki/Media_type
[microservices-messaging]: https://blog.codeship.com/microservices-messaging-rest-isnt-always-best-choice/
[pragmatic-rest]: https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
[rabbitmq]: https://www.rabbitmq.com
[rdf]: https://en.wikipedia.org/wiki/Resource_Description_Framework
[rest]: https://en.wikipedia.org/wiki/Representational_state_transfer
[rest-maturity]: https://www.crummy.com/writing/speaking/2008-QCon/act3.html
[rest-maturity-fowler]: https://martinfowler.com/articles/richardsonMaturityModel.html
[rest-maturity-levin]: https://blog.restcase.com/4-maturity-levels-of-rest-api-design/
[rest-standards]: https://standards.rest
[rest-still-relevant]: https://nordicapis.com/is-rest-still-a-relevant-api-style/
[rest-with-hypermedia]: https://reflectoring.io/rest-hypermedia/
[roy-fielding-thesis]: https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
[s3-api]: https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html
[siren]: https://github.com/kevinswiber/siren
[twitter-api]: https://developer.twitter.com/en/docs/api-reference-index
[vnd-media-type]: https://en.wikipedia.org/wiki/Media_type#Vendor_tree
[wamp]: https://wamp-proto.org
[web-linking]: https://tools.ietf.org/html/rfc8288