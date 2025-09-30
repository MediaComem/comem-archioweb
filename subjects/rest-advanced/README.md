# REST In Depth

Learn about more advanced [REST][rest] concepts like [HATEOAS][hateoas], and the
various ways REST APIs are implemented in the wild, from "practical REST" to
"true REST".

**Recommended reading**

- [REST introduction & HTTP](../rest/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Richardson Maturity Model](#richardson-maturity-model)
  - [How RESTful is my API?](#how-restful-is-my-api)
  - [REST maturity level](#rest-maturity-level)
  - ["Not really REST" APIs - Levels 0 & 1](#not-really-rest-apis---levels-0--1)
  - ["Practical REST" APIs - Level 2](#practical-rest-apis---level-2)
  - ["True REST" hypermedia APIs - Level 3](#true-rest-hypermedia-apis---level-3)
    - [Hypermedia](#hypermedia)
    - [Hyperlinks in HTTP](#hyperlinks-in-http)
    - [Format of the `Link` header](#format-of-the-link-header)
    - [The OPTIONS method in HTTP](#the-options-method-in-http)
    - [Hyperlinks in REST APIs](#hyperlinks-in-rest-apis)
    - [Custom Hypermedia Type](#custom-hypermedia-type)
    - [To HATEOAS or not to HATEOAS?](#to-hateoas-or-not-to-hateoas)
- [URL structure](#url-structure)
  - [Retrieving a collection or a single resource](#retrieving-a-collection-or-a-single-resource)
    - [What should the URL of a single resource be?](#what-should-the-url-of-a-single-resource-be)
  - [Nested (or hierarchical) URLs](#nested-or-hierarchical-urls)
  - [Flat URLs](#flat-urls)
  - [Nested vs. flat URLs](#nested-vs-flat-urls)
  - [Using both nested & flat URLs](#using-both-nested--flat-urls)
  - [Filtering with URLs](#filtering-with-urls)
    - [Use URL query parameters for filtering](#use-url-query-parameters-for-filtering)
- [Resources vs. actions](#resources-vs-actions)
  - [Modeling actions with REST](#modeling-actions-with-rest)
  - [REST actions as properties](#rest-actions-as-properties)
  - [REST actions that should really be resources](#rest-actions-that-should-really-be-resources)
  - [REST actions as a sub-resource](#rest-actions-as-a-sub-resource)
  - [REST actions as a collection](#rest-actions-as-a-collection)
    - [Using a collection of actions](#using-a-collection-of-actions)
- [Linked resources](#linked-resources)
  - [Embedded resource](#embedded-resource)
  - [Resource reference via ID](#resource-reference-via-id)
  - [Resource reference via hyperlink](#resource-reference-via-hyperlink)
  - [Optional resource embedding](#optional-resource-embedding)
  - [Embedding a collection](#embedding-a-collection)
  - [Multiple resource references](#multiple-resource-references)
- [Pagination](#pagination)
  - [Huge collections](#huge-collections)
  - [What you need for pagination](#what-you-need-for-pagination)
    - [Telling the client how to get more](#telling-the-client-how-to-get-more)
  - [The `Link` header (solution 1)](#the-link-header-solution-1)
    - [Pagination with the `Link` header](#pagination-with-the-link-header)
  - [Custom headers (solution 2)](#custom-headers-solution-2)
    - [Custom headers in the response](#custom-headers-in-the-response)
  - [JSON envelope (solution 3)](#json-envelope-solution-3)
  - [Hypermedia pagination (solution 4)](#hypermedia-pagination-solution-4)
- [Resources](#resources)
- [Alternatives to REST](#alternatives-to-rest)

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

| Method   | Description                                  |
| :------- | :------------------------------------------- |
| `GET`    | Retrieve a resource at an URL.               |
| `POST`   | Create a new resource subordinate to an URL. |
| `PUT`    | Replace (modify) the resource at an URL.     |
| `PATCH`  | Partially modify a resource at an URL.       |
| `DELETE` | Delete the resource identified by an URL.    |

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

- **Hyperlinks** tell the client **where other resources are**.
- **Forms** tell the client **what it can do to the resources**.

To use a website, the client (i.e. the browser) only needs to:

- Know the entry point (e.g. `http://example.com`).
- Understand the HTML format (the `text/html` [media type][media-type]): not
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

#### Format of the `Link` header

Multiple links in the header are comma-separated.
Each link looks like this:

```
  <https://example.com/api/movies?page=1&pageSize=50>; `rel="first prev"`
```

It contains:

- The **target URL** between `<>`
- One or more **parameters** preceded by `;`:

The `rel` (or "relation") parameter is mandatory, as it indicates **what kind of
link it is**. There is a [registry of official relation
types][iana-link-relations] (such as `first`, `prev`, `next` and `last` for
collections).

You can use your own custom relation types but instead of single words, they
should be URIs:

```
  <http://example.com/manual>; `rel="http://example.com/my-rels/rtfm"`
```

You don't have to build this format by hand. You can probably find a package
that does it for you. For example, a quick [search for "link
header"][npm-search-link-header] in the npm registry suggests several packages:
[format-link-header][npm-format-link-header],
[parse-link-header][npm-parse-link-header],
[http-link-header][npm-http-link-header], and more.

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

- [JSON:API][json-api]
- [Collection+JSON][collection-json]
- [Hypertext Application Language (HAL)][hal] - [(Draft RFC)][hal-rfc]
- [JSON for Linking Data (JSON-LD)][json-ld] - [(W3C Spec)][json-ld-spec]
- [JSON Hyper-Schema (RFC Draft)][json-hyper-schema]
- [Siren][siren]

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

## URL structure

Resources often have relationships:

- A resource which represents a **collection** has items (e.g. users/user).
- Blog **posts** have **comments**.
- **Courses** are taught by **professors**.

How should we define the URLs to retrieve those resources?

### Retrieving a collection or a single resource

Assume there is a resource which represents the list of users in a blog:

```
  http://blog.example.com/users
```

What should be the URL that identifies user number 2?

```
  http://blog.example.com`/user/2`
  http://blog.example.com`/users/2`
```

#### What should the URL of a single resource be?

Technically, the second solution is more correct with regards to URL
structure and HTTP:

```
  http://blog.example.com/users    (collection)
  http://blog.example.com/users/2  (item in the collection)
```

- `/users/2` expresses that user number `2` is somehow contained within the
  `users` collection. The URL expresses the **hierarchical relationship**
  between the two resources.
- When creating a user with a `POST /users` request, the HTTP specification
  states that the created resource should be a **subordinate** of the resource
  identified by the request, so it makes sense to reflect that relationship in
  the URL.
- Many prefer to use `users` in both the collection and item URL so you do not
  have to worry about switching between singular and plural (e.g.
  `people/person`).

> This is a matter of debate. You will see both solutions implemented in
> real-world APIs. What's important is not mix the two techniques to avoid
> confusion.

### Nested (or hierarchical) URLs

Suppose I want to get the comments on post 892 of a blog.

The URL can be **nested** and mirror the **hierarchical structure** between the resources:

```
  http://blog.example.com`/posts`/892`/comments`
```

Or it can be **flat** (only one path level) and have _query parameters_ like this:

```
  http://blog.example.com`/comments`?postId=892
```

In this case, the **nested** or **hierarchical** version probably makes more sense if you assume that:

- A post comment **cannot exist** outside of a post
- You'll probably **never want to display all comments** across posts,
  only the comments of a specific post

### Flat URLs

Suppose I want to retrieve the courses given by professor Arnold.

Again, the URL could be **nested**:

```
  http://heig-vd.ch`/professors`/arnold`/courses`
```

Or it could be **flat**:

```
  http://heig-vd.ch`/courses`?professor=arnold
```

In this case, the **flat** version probably makes more sense because:

- The existence of the course **does not depend** on the existence of the professor
  (if you murder Arnold, someone else will take over the course)
- You'll probably want to be able to **list all courses** on a page somewhere

### Nested vs. flat URLs

There is no _right or wrong_ answer.
You will find both styles in popular REST APIs.
When defining your API's URLs, you should ask yourself:

> Is there an **ownership** or **composition** relationship between these resources?

In this case, it makes sense to use **nested** or hierarchical URLs.

> Will I need to **display all the resources** of this type on a page somewhere?

In that case, it makes sense to use **flat** URLs.

### Using both nested & flat URLs

It's also possible to define **multiple collections** for the same resource at **different paths**:

```
  GET /courses
  GET /professors/arnold/courses
```

- The first collection (`/courses`) can be used to list **all courses**
- The second collection (`/professors/arnold/courses`) can be used to list **the courses taught by professor arnold**

These two collections both produce a list of resources of the same type (courses), but **they are different collections**.
Their contents will vary over time, and most of the time the two collections will not produce the same result (there are courses taught by other professors).

### Filtering with URLs

Which URL structure is better for filtering parts of a collection?

```
  GET /employees/byDepartment/accounting
  GET /employees/byLastName/Smith

  GET /employees?department=accounting
  GET /employees?lastName=Smith
```

The first two are simply not practical. What happens when you want to retrieve
all people named Smith in the accounting department? Either you cannot, or you
will end up with clunky, unintuitive URLs:

```
  GET /employees/byDepartmentAndLastName/accounting/Smith
  GET /employees/byLastName/Smith/andByDepartment/accounting
```

#### Use URL query parameters for filtering

The path of the URL is not meant to contain multiple dynamic parameters.
However, the query string exists for just this purpose:

```
  GET /employees`?`department=accounting
  GET /employees`?`department=accounting`&`lastName=Smith
  GET /employees`?`lastName=Doe`&`department=sales
```

You can combine query parameters however you want (provided the implementation
of the server supports it).

It is also more logical to have the single resource `GET /employees` which you
can filter with additional parameters. In the end, all responses to these
requests are lists of employees.

Always prefer query parameters to
filter collections.

## Resources vs. actions

Fundamental to the REST architectural style is the idea that you are performing
actions on resources. In the context of the web this usually means:

- The **HTTP method** is the **action**: `GET`, `POST`, `PUT`, etc.
- The **URL** identifies the **resource**, i.e. the thing being manipulated.

Which ones of these HTTP requests do you think are RESTful?

- `GET /api/comments`
- `POST /api/users`
- `PUT /api/users/:id`
- `POST /api/users/:id/enable`
- `POST /api/users/:id/disable`
- `POST /api/users/:id/follow`
- `POST /api/comments/:id/star`
- `POST /api/comments/:id/unstar`

### Modeling actions with REST

The last 5 requests are technically **not RESTful**, for example:

- `POST /api/users/:id/enable`

The URL ends with **a verb instead of a noun**, therefore:

- The URL represents an action (verb) instead of a resource (noun).
- There are 2 actions: the HTTP method, `POST`, and the one in the URL,
  `enable`.

In theory, the only action should be the HTTP method, and the URL should always
represent the "thing" being acted upon, not an action.

### REST actions as properties

Take the following non-RESTful actions:

- `POST /api/users/:id/enable`
- `POST /api/users/:id/disable`

They could be modeled as a user property instead:

```json
{
  "username": "jdoe",
* "enabled": true
}
```

You could then update that property with `PUT` or `PATCH`. The following call
could be made to disable the user:

```http
PATCH /api/users/jdoe HTTP/1.1
Content-Type: application/json

{ "enabled": false }
```

### REST actions that should really be resources

Take the following non-RESTful action:

- `POST /api/users/:id/follow`

It's very likely that at some point you'll be needing the list of a user's
followers. This should really be a collection resource that you can add
followers to:

- `POST /api/users/:id/followers`

That way, you can simply implement this call in the future to list a user's
followers:

- `GET /api/users/:id/followers`

### REST actions as a sub-resource

Take the following non-RESTful action:

- `POST /api/comments/:id/star`
- `POST /api/comments/:id/unstar`

If you assume that you can only only star/unstar a comment (i.e. there is only
one star, not a range from 1 to 5), you can model it as a single sub-resource of
each comment:

- `PUT /api/comments/:id/star`
- `DELETE /api/comments/:id/star`

> The first version uses the **verb** "star", while the second version uses the
> **noun** "star", with the HTTP method indicating the action. Also note that
> "star" is used in the singular, since there is only one.

### REST actions as a collection

Take the following non-RESTful actions:

- `POST /api/users/:id/enable`
- `POST /api/users/:id/disable`

We already described one way of modeling these as a property.

However in some cases, you might need to remember all actions that were taken on
a resource for **auditing** or **security** purposes. For example: GitHub has a
page that lists all security-related actions on your user account, so that you
might see if someone else obtained access to your account and did something bad.

In that case, you might want to have a collection resource that represents the
actions taken on a given user:

- `POST /api/users/:id/actions`
- `GET /api/users/:id/actions`

#### Using a collection of actions

With such a collection, you would `POST` to create actions:

```http
POST /api/users/jdoe/actions HTTP/1.1
Content-Type: application/json
Location: https://example.com/api/users/jdoe/actions/321

*{ "type": "disable", "reason": "He looks suspicious." }
```

> The JSON property `"type"` is used in this example to determine what action to
> take. Other properties would depend on the type of action.

Then later you could `GET /api/users/jdoe/actions` to retrieve the list of
actions that were performed:

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "type": "disable", "reason": "He looks suspicious.", "date": "2010-01-01" },
  { "type": "changePassword", "date": "2008-03-01" },
  { "type": "confirmEmail", "date": "2008-01-01" }
]
```

Now you have all the data you need for that audit/security page.

## Linked resources

This section will discuss different ways to represent links between resources as well as their pros and cons.

Suppose that your RESTful API handles **movies** and **directors** where one movie has **one** director,
and that it provides the following operation:

```
  GET /movies/:id
```

You will retrieve the movie's data, of course, but what do you expect to see concerning the movie's **director**?

### Embedded resource

The director can be **embedded** into the movie's data:

```json
{
  "id": "oa9ufne",
  "title": "The Fellowship of the Ring",
  "rating": 8.9,
* "director": {
*   "id": "la09sld",
*   "name": "Peter Jackson",
*   "gender": "male"
* }
}
```

- _Advantage:_ it **reduces chattiness**: fewer requests have to be made to the
  server to retrieve both the movie's and the director's data.
- _Disadvantage:_ **more data** is exchanged between client and server **that
  the client might not always need**.

### Resource reference via ID

To save bandwidth, only a unique identifier for the director could be included:

```json
{
  "title": "The Fellowship of the Ring",
  "rating": 8.9,
* "directorId": "la09sld"
}
```

- _Advantages:_
  - **Smaller JSON payloads**.
- _Disadvantages:_

  - It **increases chattiness**: the client has to make two requests to retrieve
    both the movie's and the director's data.
  - The client **must know how to build the URL** to the director resource,
    which is not always obvious (e.g. you could think it's `/directors/la09sld`
    but it could be `/people/la09sld`).

    > This would be considered to be at REST maturity level 2 because it is not
    > hypermedia.

### Resource reference via hyperlink

Instead of just the ID, you could include a hyperlink to the director's resource:

```json
{
* "_links": {
*   "http://example.com/links/director": {
*     "href": "http://example.com/api/people/la09sld"
*   }
* }
  "title": "The Two Towers",
  "rating": 7.1
}
```

- _Advantage:_ **decouples** the client from your API through **hypermedia**:
  the client can browse the API without knowing your URLs in advance
  ([HATEOAS][hateoas]).
- _Disadvantages:_ it **increases chattiness**. It requires **more requests by
  the client** to follow link relations instead of accessing URLs directly.

> This would be REST maturity level 3. If you use this solution, you should use an appropriate media type instead of
> plain JSON. The above example uses [HAL][hal] but there are others like [JSON:API][json-api], or you can
> define your own.

### Optional resource embedding

Again, there's no _right or wrong_ answer: it depends on your use case. By
spending a little more time on your server's implementation, it's also possible
to **combine** some of these patterns:

<!-- slide-column -->

```http
GET /api/movies/312
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "title": "The Two Towers",
  "rating": 7.1,
  "directorId": "la0"
}
```

<!-- slide-column -->

```http
GET /api/movies/312?`include=director`
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "title": "The Two Towers",
  "rating": 7.1,
  "directorId": "la0",
* "director": {
*   "id": "la09sld",
*   "name": "Peter Jackson",
*   "gender": "male"
* }
}
```

<!-- slide-container -->

This **lets the client decide** what's most appropriate **for each request** (depending on the view it is rendering).

### Embedding a collection

You can ask yourself the same questions for **one-to-many** or **many-to-many** relationships:

<!-- slide-column 55 -->

```json
{
  "name": "John Doe",
  "addresses": [
    {
      "street": "8785 Windfall St.",
      "city": "Whitehall, PA 18052"
    },
    {
      "street": "1 N. Cactus Ave.",
      "city": "Green Bay, WI 54302"
    }
  ]
}
```

<!-- slide-column -->

```json
{
  "name": "Apple",
  "employees": [
    {
      "firstName": "Tim",
      "lastName": "Cook",
      "title": "CEO"
    },
    {
      "firstName": "Jony",
      "lastName": "Ive",
      "title": "CDO"
    }
  ]
}
```

<!-- slide-container -->

When embedding collections, be mindful of the **amount of data**.
Embedding a person's addresses is probably reasonable, as few people will have many different addresses,
but embedding a company's employees is probably a really bad idea.

### Multiple resource references

You can also use identifiers or hypermedia for links to multiple resources:

```json
{
  "name": "John Doe",
  "addresses": [412, 633]
}
```

```json
{
  "title": "Die Hard With a Vengance",
  "_embedded": [
    {
      "_links": { "href": "https://example.com/api/people/0a9duvx" }
    },
    {
      "_links": { "href": "https://example.com/api/people/acsl9w2" }
    },
    {
      "_links": { "href": "https://example.com/api/people/7dis92k" }
    }
  ]
}
```

## Pagination

What's the problem with this HTTP request?

```http
GET /phone-numbers?city=Tokyo HTTP/1.1
Host: world-phonebook.com
```

### Huge collections

Some collections can grow to a point where it is not possible to get all of its elements in a single HTTP request:

- It would be **too slow**
- In some cases, the server might not even have enough CPU or memory **capacity** to retrieve the data

You want to be able to **successively retrieve pages** of the collection:

<p class='center'><img src='images/google-pagination.png' /></p>

### What you need for pagination

There are two main requirements to be able to implement pagination:

- The client must be able to tell the server **which elements** of the collection it wants
- The server must give the client enough information to be able to **access the other elements**

The most common way for clients to ask for a page is to add **URL query parameters** which the server can use to select only part of the collection:

```http
  GET /api/movies?`page=2`&`pageSize=50`
```

#### Telling the client how to get more

There are many different ways popular APIs tell the client how to get more elements.
Here are a few:

- The `Link` header
- Custom headers
- Using a JSON _envelope_ or _wrapper_

### The `Link` header (solution 1)

There have been many ways developers have implemented pagination over the years.

The relatively recent [`Link` header][web-linking] allows the server to **tell
the client where to find other pages** of the collection, **without the client
having to build new URLs** ([HATEOAS][hateoas]).

The server can indicate where to find:

- The first page
- The previous page
- The next page
- The last page
- _(Other variants if necessary)_

#### Pagination with the `Link` header

Consider the following request where the client requests the second page of 50
elements in a collection:

```http
GET /api/movies?`page=2`&`pageSize=50` HTTP/1.1
```

In the response, in addition to the 50 movies on that page, the server can send
a `Link` header with references to **the URLs of other pages** of the
collection:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Link: <https://example.com/api/movies?`page=1`&pageSize=50>; rel="`first prev`",
      <https://example.com/api/movies?`page=3`&pageSize=50>; rel="`next`",
      <https://example.com/api/movies?`page=5`&pageSize=50>; rel="`last`"

[
  ...
]
```

### Custom headers (solution 2)

The `Link` header has the advantage of being a standard, but it's harder to
build a **pager** from it:

<p class='center'><img src='images/pagination.png' /></p>

The server would need to send pre-built **links for each page**, and there are
no standard link relations for that.

HTTP does not forbid you from using non-standard headers,
so you could decide to use these **custom headers** to send the client the additional information it needs:

- A `Pagination-Page` header to tell the client which page is being served
- A `Pagination-Page-Size` header to tell the client what is the current page size
- A `Pagination-Total` header to tell the client how many elements there are in the collection

#### Custom headers in the response

Consider the following request where the client requests the second page of 50 elements in a collection:

```http
GET /api/movies?`page=2`&`pageSize=50` HTTP/1.1
```

In the response, in addition to the 50 movies on that page, the server can send the custom pagination headers:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
*Pagination-Page: 2
*Pagination-Page-Size: 50
*Pagination-Total: 231

[
  ...
]
```

### JSON envelope (solution 3)

In some rare circumstances, there is a proxy between client and server that **strips some headers** from requests.
In this case, you would have to send the pagination information in the **response body** instead of headers.

Instead of using a **JSON array** as the response body,
you can use a **JSON object** that contains additional metadata as well as the array of elements:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  `"page": 2`,
  `"pageSize": 50`,
  `"total": 231`,
  `"data": [`
    ...
  `]`
}
```

### Hypermedia pagination (solution 4)

Most hypermedia formats, like [JSON:API][json-api] or [HAL][hal], also allow you
to include the pagination information in the response with standard link
relations:

```http
HTTP/1.1 200 OK
Content-Type: application/hal+json; charset=utf-8

{
  `"data": [`
    ...
  `]`,
* "_links": {
*   "first": {
*     "href": "https://example.com/api/movies?page=1&pageSize=50"
*   },
*   "prev": {
*     "href": "https://example.com/api/movies?page=1&pageSize=50"
*   },
*   "next": {
*     "href": "https://example.com/api/movies?page=3&pageSize=50"
*   },
*   "last": {
*     "href": "https://example.com/api/movies?page=5&pageSize=50"
*   },
* }
}
```

## Resources

- [HTTP methods][http-methods], [Web Linking][web-linking]
- APIs: [Flickr][flickr-api] (L1), [AWS S3][s3-api] (L2), [Twitter][twitter-api] (L2), [GitHub][github-api] (L3), [Foxy][foxy-api] (L3)
- [JSON:API][json-api], [Collection+JSON][collection-json], [HAL][hal], [JSON Hyper-Schema][json-hyper-schema], [JSON-LD][json-ld], [Siren][SIREN]
- [Standards.REST: don't reinvent the wheel, use fantastic wheels][rest-standards]

**Further reading**

- [Architectural Styles and the Design of Network-based Software Architectures (Roy Fielding)][roy-fielding-thesis]
- [The Maturity Heuristic (Leonard Richardson)][rest-maturity] - [Richardson Maturity Model (Martin Fowler)][rest-maturity-fowler] - [4 Maturity Levels Of REST API Design (Guy Levin)][rest-maturity-levin]
- [How to GET a Cup of Coffee][get-coffee]
- [Best Practices for Designing a Pragmatic RESTful API][pragmatic-rest]
- [REST with Hypermedia - Hot or Not?][rest-with-hypermedia]
- [Haters Gonna HATEOAS][haters-gonna-hateoas]

## Alternatives to REST

[REST][rest] is a well-defined architectural style and industry standard that
confers useful properties to your API if followed: performance, scalability, a
uniform interface, portability, evolvability, etc. However, it also come with
constraints. REST might not always be the best fit for all use cases.

> "If all you have is a hammer, everything starts to look like a nail."

**Alternatives**

- Plain old RPC: [gRPC][grpc]
- Newcomer: [GraphQL][graphql] (see the [Facebook API][facebook-api])
- Microservices messaging for complex distributed applications: [Apache Kafka][kafka], [RabbitMQ][rabbitmq], [WAMP][wamp]

**Further reading**

- [Is REST still a relevant API style?][rest-still-relevant]
- [Microservices messaging: why REST isn't always the best choice][microservices-messaging]

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
[haters-gonna-hateoas]: http://timelessrepo.com/haters-gonna-hateoas
[html-form]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
[http-allow]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow
[http-cache]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
[http-conditional]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests
[http-get]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET
[http-idempotence]: https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
[http-methods]: https://www.rfc-editor.org/rfc/rfc9110.html#name-methods
[http-options]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
[http-partial]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
[http-safe]: https://developer.mozilla.org/en-US/docs/Glossary/Safe
[hypermedia]: https://en.wikipedia.org/wiki/Hypermedia
[hyperlink]: https://en.wikipedia.org/wiki/Hyperlink
[iana]: https://www.iana.org
[iana-link-relations]: https://www.iana.org/assignments/link-relations/link-relations.xhtml
[iana-media-types]: https://www.iana.org/assignments/media-types/media-types.xhtml
[json-api]: https://jsonapi.org
[json-hyper-schema]: https://datatracker.ietf.org/doc/draft-handrews-json-schema-hyperschema/
[json-ld]: https://json-ld.org
[json-ld-spec]: https://www.w3.org/2018/jsonld-cg-reports/json-ld/
[kafka]: https://kafka.apache.org
[media-type]: https://en.wikipedia.org/wiki/Media_type
[microservices-messaging]: https://blog.codeship.com/microservices-messaging-rest-isnt-always-best-choice/
[npm-http-link-header]: https://www.npmjs.com/package/http-link-header
[npm-format-link-header]: https://www.npmjs.com/package/format-link-header
[npm-parse-link-header]: https://www.npmjs.com/package/parse-link-header
[npm-search-link-header]: https://www.npmjs.com/search?q=link+header
[pragmatic-rest]: https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
[rabbitmq]: https://www.rabbitmq.com
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
