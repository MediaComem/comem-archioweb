# Using Mongoose with Express

Learn how to implement advanced RESTful API operations in [Express][express] with [Mongoose][mongoose] (a [MongoDB][mongodb] Object-Document Mapper).

**You will need**

* A running [MongoDB][mongodb] database
* A running [Express][express] application with [Mongoose][mongoose] plugged in

**Recommended reading**

* [RESTful APIs](../rest/)
* [RESTful API Conventions](../rest-conventions/)
* [Express](../express/)
* [Mongoose](../mongoose/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Demonstration RESTful API](#demonstration-restful-api)
- [Filtering](#filtering)
  - [Limiting collections](#limiting-collections)
  - [Simple filters](#simple-filters)
  - [Dynamic filters](#dynamic-filters)
- [Pagination](#pagination)
  - [Paginating collections](#paginating-collections)
  - [Using query parameters to select a page](#using-query-parameters-to-select-a-page)
  - [Telling the client how to get more elements](#telling-the-client-how-to-get-more-elements)
  - [Using the `Link` header (solution 1)](#using-the-link-header-solution-1)
  - [Using custom pagination headers (solution 2)](#using-custom-pagination-headers-solution-2)
  - [Using a JSON envelope (solution 3)](#using-a-json-envelope-solution-3)
- [Aggregation](#aggregation)
  - [Aggregation example](#aggregation-example)
  - [Aggregation pipeline](#aggregation-pipeline)
  - [Aggregation pipeline example](#aggregation-pipeline-example)
  - [Aggregation pipeline operators](#aggregation-pipeline-operators)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Demonstration RESTful API

The examples in this tutorial are taken from a RESTful API developed to demonstrate how to implement REST concepts.

You will find the [source code][demo] of this API and its [documentation][demo-doc] on GitHub.
The API is also deployed on [Heroku][heroku] (follow the instructions in the documentation to try it).

You should read about the [resources][demo-res] that you can manipulate with this API before moving on.



## Filtering

<!-- slide-front-matter class: center, middle -->

<p class='center'><img src='images/filtering.png' /></p>

How do I get only the right stuff?



### Limiting collections

Often when clients make requests on a RESTful API's **collection** resource,
they don't need the whole thing; they need **only the items they are interested in** for the current view.

For example, you might want to display:

* The list of movies directed by someone
* The list of movies with a rating greater than or equal to 8
* The list of movies directed by either of your two favorite directors



### Simple filters

Express gives you access to **URL query parameters** in `req.query`,
and Mongoose offers a chainable **query builder**; they're very easy to plug together:

```js
// GET /api/movies
router.get('/', function(req, res, next) {
  let `query` = Movie.find();

  // Filter movies by director
  if (ObjectId.isValid(req.query.director)) {
    `query = query.where('director').equals(req.query.director)`;
  }
  // Limit movies to only those with a good enough rating
  if (!isNaN(req.query.ratedAtLeast)) {
    `query = query.where('rating').gte(req.query.ratedAtLeast)`;
  }

  // Execute the query
  `query.exec`(function(err, movies) {
    if (err) {
      return next(err);
    }
    res.send(movies);
  });
});
```



### Dynamic filters

What about our director filter?
Can we make it work for **multiple directors** as well?
Yes we can:

```js
// GET /api/movies
router.get('/', function(req, res, next) {
  let `query` = Movie.find();

  // Filter movies by director
  if (`Array.isArray(req.query.director)`) {
    // Find all movies directed by any of the specified directors
    const directors = req.query.director.filter(ObjectId.isValid);
    `query = query.where('director').in(directors)`;
  } else if (ObjectId.isValid(req.query.director)) {
    // Find all movies directed by a specific person
    `query = query.where('director').equals(req.query.director)`;
  }

  // ...
});
```



## Pagination

<!-- slide-front-matter class: center, middle -->

<p class='center'><img src='images/pagination.png' /></p>

How do I get a reasonable amount of stuff?



### Paginating collections

Some collections are just **too large to send** to the client in their entirety.
The following examples will demonstrate two ways implement **pagination**
to retrieve only one "page" of a collection at a time.

The following examples assume that you have read [RESTful API Conventions](../rest-conventions/) which explains different ways to expose pagination in a RESTful API.



### Using query parameters to select a page

In principle, pagination is a **specialized filter**. The client uses **URL query parameters** to tell the server which chunk of the collection it wants.
Implementing a `page` and `pageSize` parameters with Express and Mongoose is quite straightforward:

```js
router.get('/', function(req, res, next) {
  let query = Movie.find();

  // Parse the "page" param (default to 1 if invalid)
  let page = parseInt(`req.query.page`, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Parse the "pageSize" param (default to 100 if invalid)
  let pageSize = parseInt(`req.query.pageSize`, 10);
  if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
    pageSize = 100;
  }

  // Apply skip and limit to select the correct page of elements
  query = query`.skip((page - 1) * pageSize).limit(pageSize)`;

  // ...
});
```



### Telling the client how to get more elements

To include information about getting more elements in the response,
you will need to know **how many elements there are in total**,
either to give that information directly to the client or to build hyperlinks.

You can do that easily using a Mongoose model's `count()` function:

```js
router.get('/', function(req, res, next) {
  `Movie.find().count(function(err, total) {`
    if (err) {
      return next(err);
    }

    let query = Movie.find();

    // Apply pagination here (code from previous example)...

    // Send response (including total/links) here...
  `})`;
});
```



### Using the `Link` header (solution 1)

The format is a bit convoluted, but other developers have already gone through the trouble for you.
Use the [format-link-header][format-link-header] npm package:

```js
const formatLinkHeader = require('format-link-headers');
`const links = {};`

function buildLinkUrl(url, page, pageSize) {
  return url + '?page=' + page + '&pageSize=' + pageSize;
}

// Add "first" and "prev" links unless it's the first page
if (page > 1) {
  `links.first` = { rel: 'first', url: buildLinkUrl(url, 1, pageSize) };
  `links.prev` = { rel: 'prev', url: buildLinkUrl(url, page - 1, pageSize) };
}

// Add "next" and "last" links unless it's the last page
if (page < maxPage) {
  `links.next` = { rel: 'next', url: buildLinkUrl(url, page + 1, pageSize) };
  `links.last` = { rel: 'last', url: buildLinkUrl(url, maxPage, pageSize) };
}

if (Object.keys(links).length >= 1) {
  `res.set('Link', formatLinkHeader(links));`
}
```



### Using custom pagination headers (solution 2)

To implement this solution, you simply have to set the headers before sending the response:

```js
router.get('/', function(req, res, next) {
  Movie.find().count(function(err, `total`) {
    if (err) { return next(err); };
    let query = Movie.find();

    // Parse the "page" param (default to 1 if invalid)
    let `page` = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) { /* ... */ }

    // Parse the "pageSize" param (default to 100 if invalid)
    let `pageSize` = parseInt(req.query.pageSize, 10);
    if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) { /* ... */ }

    // Apply skip and limit to select the correct page of elements
    query = query.skip((page - 1) * pageSize).limit(pageSize);

    `res.set('Pagination-Page', page);`
    `res.set('Pagination-PageSize', pageSize);`
    `res.set('Pagination-Total', total);`

    // ...
  });
});
```



### Using a JSON envelope (solution 3)

Instead of setting headers, you simply have to build and pass your envelope to `res.send()`:

```js
router.get('/', function(req, res, next) {
  Movie.find().count(function(err, `total`) {
    if (err) { return next(err); };

    let query = Movie.find();

    // Parse query parameters and apply pagination here...

    query.exec(function(err, `movies`) {
      if (err) { return next(err); }

      // Send JSON envelope with data
*     res.send({
*       page: page,
*       pageSize: pageSize,
*       total: total,
*       data: movies
*     });
    });
  });
});
```



## Aggregation

<!-- slide-front-matter class: center, middle -->

<p class='center'><img src='images/aggregation.png' class='w60' /></p>



### Aggregation example

Let's say that when we retrieve **People** from the API, we also want to know **how many movies they have directed**.

In SQL, assuming People and Movies are in **different tables**, you would use a **JOIN** and a **GROUP BY** to get that information:

```sql
SELECT people.*, SUM(movies.id) AS directed_movies_count
  FROM `people INNER JOIN movies` ON (people.id = movies.director_id)
  `GROUP BY` people.id;
```

#### No join in MongoDB

However, there is **no JOIN** in MongoDB.

If your related documents (People and Movies) are stored in two **separate collections** (as is the case in the demonstration RESTful API),
there is **no way to retrieve that information in ONE query**.

<p class='center'><img src='images/domain-model.png' class='w70' /></p>

But what you can do is:

* Find the People you need (using `Person.find()`)
* Count how many movies they have directed in one query using [MongoDB aggregations][mongodb-aggregation]



### Aggregation pipeline

The preferred MongoDB aggregation method is the [aggregation pipeline][mongodb-aggregation-pipeline]:
documents go through a multi-stage pipeline where **each stage transforms the collection of documents** into **aggregated results**.

Mongoose models have an `aggregate()` function you can call with an **array of stages** to apply:

```js
Movie.`aggregate`([ stage1, stage2, stage3 ]);
```

Each **stage** is an object with an [aggregation pipeline operator][mongodb-aggregation-pipeline-operators]:

```js
{
  `$match`: {
    director: { $in: [ 'abc', 'def', 'ghi' ] }
  }
}
```

### Aggregation pipeline example

Let's say you have retrieved a list of Person documents from the database,
and you want to know how many Movies they have directed:

```js
const people = [ /* List of Person documents from the database */ ];

// Get the documents' IDs
const personIds = people.map(person => person._id);

Movie.`aggregate`([
  {
    `$match`: { // Select movies directed by the people we are interested in
      director: { $in: personIds }
    }
  },
  {
    `$group`: { // Group the documents by director ID
      _id: '$director',
      moviesCount: { // Count the number of movies for that ID
        $sum: 1
      }
    }
  }
], function(err, results) {
  // Use the results...
});
```

#### How does it work?

<p class='center'><img src='images/aggregation-pipeline.png' class='w90' /></p>

#### Adding the aggregation results to the response

That's all well and good, but you still have two separate sets of data:

* The People you have retrieved with the **first query**
* The aggregated number of Movies you have retrieved with the **aggregation query**

If you just do `res.send(people)`, you will get this:

```json
[
  { "name": "Renny Harlin" },
  { "name": "Peter Jackson" }
]
```

What you want is this:

```json
[
  { "name": "Renny Harlin", "moviesCount": 1 },
  { "name": "Peter Jackson", "moviesCount": 3 }
]
```

#### Combining the results

Here's how you can **combine** the array of People documents and the array of aggregated Movie counts:

```js
const people = [ /* List of Person documents from the database */ ];
const results = [ /* Aggregation results */ ];

// Convert the Person documents to JSON
const peopleJson = people.map(person => person.toJSON());

// For each result...
results.forEach(function(result) {
  // Get the director ID (that was used to $group)...
  const resultId = result._id.toString();
  // Find the corresponding person...
  const correspondingPerson = peopleJson.find(person => person.id == resultId);
  // And attach the new property
  correspondingPerson.directedMoviesCount = result.moviesCount;
});

// Send the enriched response
res.send(peopleJson);
```

### Aggregation pipeline operators

There are many operators you can use in pipeline aggregation stages.
They are all described in [the documentation][mongodb-aggregation-pipeline-operators].
Here are some of the most useful:

Operator   | Description
:---       | :---
`$group`   | Groups documents by a specified identifier expression and applies the accumulator expression(s), if specified, to each group
`$limit`   | Passes the first *n* documents unmodified to the pipeline
`$match`   | Filters documents to allow only matching documents to pass unmodified into the next pipeline stage
`$project` | Reshapes each document, such as by adding new fields or removing existing fields
`$skip`    | Skips the first *n* documents
`$sort`    | Reorders the documents by a specified sort key



## Resources

**Documentation**

* [MongoDB aggregation][mongodb-aggregation]



[demo]: https://github.com/MediaComem/comem-webdev-express-rest-demo
[demo-doc]: https://mediacomem.github.io/comem-webdev-express-rest-demo/
[demo-res]: https://github.com/MediaComem/comem-webdev-express-rest-demo#resources
[express]: https://expressjs.com
[format-link-header]: https://www.npmjs.com/package/format-link-header
[heroku]: https://www.heroku.com
[link-header-rels]: http://www.iana.org/assignments/link-relations/link-relations.xhtml
[link-header-rfc]: https://tools.ietf.org/html/rfc5988
[mongodb]: https://www.mongodb.com
[mongodb-aggregation]: https://docs.mongodb.com/manual/aggregation/
[mongodb-aggregation-pipeline]: https://docs.mongodb.com/manual/core/aggregation-pipeline/
[mongodb-aggregation-pipeline-operators]: https://docs.mongodb.com/manual/reference/operator/aggregation/
[mongoose]: http://mongoosejs.com
