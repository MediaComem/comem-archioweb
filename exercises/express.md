# Express.js exercises

Implement routes in an Express.js application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Hello, World!](#hello-world)
- [That does not compute](#that-does-not-compute)
- [Reading](#reading)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Hello, World!

Create a `GET /hello` route which salutes the world. The Content-Type of the
response must be `text/plain`.

**Request**

```http
GET /hello HTTP/1.1
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: text/plain

Hello, World!
```

When given the URL query parameter `name`, it should salute that person.

**Request**

```http
GET /hello?name=Bob HTTP/1.1
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: text/plain

Hello, Bob!
```



## That does not compute

Create a `POST /computations` route which returns information about a list of
numbers.

**Request**

```http
POST /computations HTTP/1.1
Content-Type: application/json

{
  "numbers": [ 2, 4, 3, 7, 8 ]
}
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "average": 4.8,
  "median": 4,
  "total": 24
}
```



## Reading

Create a `GET /books/:id` route which returns information about books.

Copy the [`books`](./books) directory into your Express.js application and use
it as a static "database" of sorts. When a request comes in, attempt to read and
return the contents of the correct book file.

**Request**

```http
GET /books/2 HTTP/1.1
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "title": "The Terran Privateer",
  "author": "Glynn Stewart",
  "publication": 2016
}
```

If the book is not in the "database", return an appropriate response.

**Request**

```http
GET /books/4 HTTP/1.1
```

**Response**

```http
HTTP/1.1 404 Not Found
```
