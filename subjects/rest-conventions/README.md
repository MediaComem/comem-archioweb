# RESTful API Conventions

Learn common ways to structure RESTful API operations.

**Recommended reading**

* [RESTful APIs](../rest/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [URL structure](#url-structure)
  - [Nested (or hierarchical) URLs](#nested-or-hierarchical-urls)
  - [Flat URLs](#flat-urls)
  - [Nested vs. flat URLs](#nested-vs-flat-urls)
  - [Using both nested & flat URLs](#using-both-nested--flat-urls)
- [Linked resources](#linked-resources)
  - [Embedded resource](#embedded-resource)
  - [Resource reference via ID](#resource-reference-via-id)
  - [Resource reference via URL or hyperlink](#resource-reference-via-url-or-hyperlink)
  - [Optional resource embedding](#optional-resource-embedding)
  - [Embedding a collection](#embedding-a-collection)
  - [Multiple resource references](#multiple-resource-references)
- [Pagination](#pagination)
  - [Huge collections](#huge-collections)
  - [What you need for pagination](#what-you-need-for-pagination)
  - [The `Link` header (solution 1)](#the-link-header-solution-1)
  - [Custom headers (solution 2)](#custom-headers-solution-2)
  - [JSON envelope (solution 3)](#json-envelope-solution-3)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## URL structure

Resources often have relationships:

* Blog **posts** have **comments**.
* **Courses** are taught by **professors**.

How should we define the URLs to retrieve those resources?



### Nested (or hierarchical) URLs

Suppose I want to get the comments on post 892 of a blog.

The URL can be **nested** and mirror the **hierarchical structure** between the resources:

```
  http://blog.example.com`/posts`/892`/comments`
```

Or it can be **flat** (only one path level) and have *query parameters* like this:

```
  http://blog.example.com`/comments`?postId=892
```

In this case, the **nested** or **hierarchical** version probably makes more sense if you assume that:

* A post comment **cannot exist** outside of a post
* You'll probably **never want to display all comments** across posts,
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

* The existence of the course **does not depend** on the existence of the professor
  (if Arnold is murdered, someone else will take over the course)
* You'll probably want to be able to **list all courses** on a page somewhere



### Nested vs. flat URLs

There is no *right or wrong* answer.
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

* The first collection (`/courses`) can be used to list **all courses**
* The second collection (`/professors/arnold/courses`) can be used to list **the courses taught by professor arnold**

These two collections both produce a list of resources of the same type (courses), but **they are different collections**.
Their contents will vary over time, and most of the time the two collections will not produce the same result (there are courses taught by other professors).



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

* *Advantage:* it **reduces chattiness**:
  fewer requests have to be made to the server to retrieve both the movie's and the director's data
* *Disadvantage:* **more data** is exchanged between client and server **that the client might not always need**



### Resource reference via ID

To save bandwidth, only a unique identifier for the director could be included:

```json
{
  "title": "The Fellowship of the Ring",
  "rating": 8.9,
* "directorId": "la09sld"
}
```

* *Advantages:*
  * **Smaller JSON payloads**
* *Disadvantages:*
  * It **increases chattiness**: the client has to make two requests to retrieve both the movie's and the director's data
  * The client **must know how to build the URL** to the director resource,
    which is not always obvious (e.g. you could think it's `/directors/la09sld` but it could be `/people/la09sld`)



### Resource reference via URL or hyperlink

Instead of just the ID, you could include a hyperlink or URL pointing to the director's resource:

```json
{
  "title": "The Two Towers",
  "rating": 7.1,
* "directorHref": "/api/people/la09sld",
}
```

```json
{
  "title": "The Two Towers",
  "rating": 7.1,
* "directorUrl": "http://example.com/api/people/la09sld"
}
```

* *Advantage:* **decouples** the client from your API through **hypermedia**:
  the client can perform many operations without knowing how to build your URLs
  (this is a REST principle called [HATEOAS][hateoas])
* *Disadvantages:* it not only **increases chattiness**,
  but also means somewhat **more data** exchanged between client and server compared to IDs,
  especially if using full URLs and you have multiple links



### Optional resource embedding

Again, there's no *right or wrong* answer: it depends on your use case.

By spending a little more time on your server's implementation,
it's also possible to **combine** some of these patterns:

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
  "directorHref": "/api/people/la0"
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
  "directorHref": "/api/people/la0",
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
  "addresses" : [
    {
      "street" : "8785 Windfall St.",
      "city" : "Whitehall, PA 18052"
    },
    {
      "street" : "1 N. Cactus Ave.",
      "city" : "Green Bay, WI 54302"
    }
  ]
}
```

<!-- slide-column -->

```json
{
  "name": "Apple",
  "employees" : [
    {
      "firstName" : "Tim",
      "lastName" : "Cook",
      "title" : "CEO"
    },
    {
      "firstName" : "Jony",
      "lastName" : "Ive",
      "title" : "CDO"
    }
  ]
}
```

<!-- slide-container -->

When embedding collections, be mindful of the **amount of data**.
Embedding a person's addresses is probably reasonable, as few people will have many different addresses,
but embedding a company's employees is probably a really bad idea.



### Multiple resource references

You can also use identifiers, hyperlinks or URLs for links to multiple resources:

<!-- slide-column -->

```json
{
  "name": "John Doe",
  "addresses" : [ 412, 633 ]
}
```

<!-- slide-column 55 -->

```json
{
  "title": "Die Hard With a Vengance",
  "actorHrefs" : [
    "/api/people/0a9duvx",
    "/api/people/acsl9w2",
    "/api/people/7dis92k"
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

* It would be **too slow**
* In some cases, the server might not even have enough CPU or memory **capacity** to retrieve the data

You want to be able to **successively retrieve pages** of the collection:

<p class='center'><img src='images/google-pagination.png' /></p>



### What you need for pagination

There are two main requirements to be able to implement pagination:

* The client must be able to tell the server **which elements** of the collection it wants
* The server must give the client enough information to be able to **access the other elements**

The most common way for clients to ask for a page is to add **URL query parameters** which the server can use to select only part of the collection:

```http
  GET /api/movies?`page=2`&`pageSize=50`
```

#### Telling the client how to get more

There are many different ways popular APIs tell the client how to get more elements.
Here are a few:

* The `Link` header
* Custom headers
* Using a JSON *envelope* or *wrapper*



### The `Link` header (solution 1)

There have been many ways developers have implemented pagination over the years.
It's only recently that a [standard header][link-header-rfc] has been defined and started becoming popular.

The `Link` header allows the server to **tell the client where to find other pages** of the collection,
**without the client having to build new URLs** (also part of [HATEOAS][hateoas]).

The server can indicate where to find:

* The first page
* The previous page
* The next page
* The last page
* *(Other variants if necessary)*

#### What's in the header?

Consider the following request where the client requests the second page of 50 elements in a collection:

```http
GET /api/movies?`page=2`&`pageSize=50` HTTP/1.1
```

In the response, in addition to the 50 movies on that page,
the server can send a `Link` header with references to **the URLs of other pages** of the collection:

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

*(**Note**: the `Link` header is shown on 3 lines here for readability, but it would be on 1 line in the actual HTTP response.)*

#### What's the link format?

Multiple links in the header are comma-separated.
Each link looks like this:

```
  <https://example.com/api/movies?page=1&pageSize=50>; rel="first prev"
```

It contains:

* The **target URL** between `<>`
* One or more **parameters** preceded by `;`:

The `rel` (or "relation") parameter is mandatory, as it indicates **what kind of link it is**.
There is a [registry of official relation types][link-header-rels] (such as `first`, `prev`, `next` and `last`).

You can use your own custom relation types but instead of single words, they should be URIs:

```
  <http://example.com/manual>; rel="http://example.com/my-rels/rtfm"
```

You don't have to build this format by hand.
You can probably find a package that does it for you.
For example, a quick [search for "link header"][npm-search-link-header] in the npm registry suggests several packages:
[format-link-header][npm-format-link-header], [parse-link-header][npm-parse-link-header], [http-link-header][npm-http-link-header], and more.



### Custom headers (solution 2)

The `Link` header has the advantage of being a standard,
but it's hard to build a **pager** from it:

<p class='center'><img src='images/pagination.png' /></p>

The server would need to send pre-built **links for each page**, which is not very flexible and consumes bandwidth.

HTTP does not forbid you from using non-standard headers,
so you could decide to use these **custom headers** (for example) to send the client the additional information it needs:

* A `Pagination-Page` header to tell the client which page is being served
* A `Pagination-PageSize` header to tell the client what is the current page size
* A `Pagination-Total` header to tell the client how many elements there are in the collection

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
*Pagination-PageSize: 50
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

#### Links in the JSON envelope

You can also use **link relations** in a JSON envelope (like with the `Link` header) if you prefer that solution:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  `"data": [`
    ...
  `]`,
* "links": {
*   "first": "https://example.com/api/movies?page=1&pageSize=50",
*   "prev": "https://example.com/api/movies?page=1&pageSize=50",
*   "next": "https://example.com/api/movies?page=3&pageSize=50",
*   "last": "https://example.com/api/movies?page=5&pageSize=50"
* }
}
```



## Resources

**Documentation**

* [`Link` header][link-header-rfc] ([official relation types](link-header-rels))

**Further reading**

* [Understanding HATEOAS][understanding-hateoas]
* [Haters gonna HATEOAS][haters-gonna-hateoas]



[hateoas]: https://en.wikipedia.org/wiki/HATEOAS
[haters-gonna-hateoas]: http://timelessrepo.com/haters-gonna-hateoas
[link-header-rels]: http://www.iana.org/assignments/link-relations/link-relations.xhtml
[link-header-rfc]: https://tools.ietf.org/html/rfc5988
[npm-http-link-header]: https://www.npmjs.com/package/http-link-header
[npm-format-link-header]: https://www.npmjs.com/package/format-link-header
[npm-parse-link-header]: https://www.npmjs.com/package/parse-link-header
[npm-search-link-header]: https://www.npmjs.com/search?q=link+header
[understanding-hateoas]: https://spring.io/understanding/HATEOAS
