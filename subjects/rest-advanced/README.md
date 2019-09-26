# REST In Depth

Learn about more advanced [REST][rest] concepts like [HATEOAS][hateoas], and the
various ways REST APIs are implemented in the wild, from "practical REST" to
"true REST".

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Richardson Maturity Model

<!-- slide-front-matter class: center, middle, image-header -->

<img src='images/richardson-maturity-model.png' class='w90' />



### How RESTful is my API?

<!-- slide-column -->

The technologies of the World Wide Web form an amazing technology stack you can
pick from when developing your REST API. However, not everyone understands all
of these technologies or how to use them to their fullest potential.

<!-- slide-column 60 -->

<img src='images/richardson-maturity-model-small.png' class='w100' />

<!-- slide-container -->

The [REST maturity model developed by Leonard Richardson][rest-maturity] splits
the web technologies used to develop REST APIs into a stack with 4 levels.

#### REST maturity level

Web developers tend to pick technologies from the bottom of the stack.

<p class='center'><img src='images/richardson-maturity-model-no-title.png' class='w85' /></p>

If you use none of these technologies, you are at level 0 and your API cannot be
called REST. The more web technologies you use, the greater your "REST maturity
level".

#### "Not really REST" APIs - Levels 0 & 1

<!-- slide-column -->

**Level 0**

One URI, one HTTP method. For example: XML-RPC and most SOAP services.

This looks more like a library of functions than a web service. It's a huge
**black box** with a single web-based peephole.

Definitely not REST: the whole web service consists of one overly complex
resource.

<!-- slide-column -->

**Level 1**

Many URIs, one HTTP method. For example: [Flickr API][flickr-api].

The web service has been **split into separate components** that each get their
own URI, which makes it much easier to understand.

It's a bit more RESTful, but not really there yet. This web service deals more
with **actions rather than resources**.

#### "Practical REST" APIs - Level 2

HTTP introduces methods (or verbs) which are [standardized and
constrained][http-methods] in their meaning:

Method   | Description
:------- | :-------------------------------------------
`GET`    | Retrieve a resource at an URL.
`POST`   | Create a new resource subordinate to an URL.
`PUT`    | Replace (modify) the resource at an URL.
`PATCH`  | Partially modify a resource at an URL.
`DELETE` | Delete the resource identified by an URL.

Using these means that you do not have to reinvent the wheel for the most common
operations on resources: creating, retrieving, updating and deleting (CRUD).

For example, `GET` has a specific meaning: it retrieves information, it must be
safe and [idempotent][idempotence], etc. Where there are constraints there are
optimizations: [caching][http-cache], [conditional requests][http-conditional],
[partial requests][http-partial] etc.



## Resources

**Documentation**

* [GitHub REST API version 3][github-api]
* [Twitter REST API][twitter-api]
* [Foxy Hypermedia REST API][foxy-api]

**Further reading**

* [Architectural Styles and the Design of Network-based Software Architectures (Roy Fielding)][roy-fielding-thesis]
* [Justice Will Take Us Millions Of Intricate Moves - Act Three: The Maturity Heuristic (Leonard Richardson)][rest-maturity]
  * [Richardson Maturity Model (Martin Fowler)][rest-maturity-fowler]
  * [4 Maturity Levels Of REST API Design (Guy Levin)][rest-maturity-levin]
* [How to GET a Cup of Coffee][get-coffee]
* [Standards.REST: don't reinvent the wheel, use fantastic wheels][rest-standards]
* [Best Practices for Designing a Pragmatic RESTful API][pragmatic-rest]



[facebook-api]: https://developers.facebook.com/docs/graph-api/
[flickr-api]: https://www.flickr.com/services/api/
[foxy-api]: https://api.foxycart.com/docs
[get-coffee]: https://www.infoq.com/articles/webber-rest-workflow/
[github-api]: https://developer.github.com/v3/
[hateoas]: https://en.wikipedia.org/wiki/HATEOAS
[http-cache]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
[http-conditional]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests
[http-methods]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
[http-partial]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
[idempotence]: https://en.wikipedia.org/wiki/Idempotence
[pragmatic-rest]: https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
[rest]: https://en.wikipedia.org/wiki/Representational_state_transfer
[rest-maturity]: https://www.crummy.com/writing/speaking/2008-QCon/act3.html
[rest-maturity-fowler]: https://martinfowler.com/articles/richardsonMaturityModel.html
[rest-maturity-levin]: https://blog.restcase.com/4-maturity-levels-of-rest-api-design/
[rest-standards]: https://standards.rest
[roy-fielding-thesis]: https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
[s3-api]: https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html
[twitter-api]: https://developer.twitter.com/en/docs/api-reference-index