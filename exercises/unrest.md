# REST exercises

The goal of these exercises is for you to use a number of provided HTTP
endpoints and determine what is "not REST" about them, or what could otherwise
be improved. You can use [Postman](https://www.postman.com/downloads/) (or your
favorite HTTP client) to make the requests.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [References](#references)
- [Make someone](#make-someone)
- [Find someone](#find-someone)
- [Bad things](#bad-things)
- [People, people everywhere](#people-people-everywhere)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## References

You may find these references useful:

* [HTTP Method Definitions (RFC 2616)](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html)
* [HTTP Status Code Definitions (RFC 2616)](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
* [HTTP Header Field Definitions (RFC 2616)](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html)
* [Uniform Resource Locator (URL)](https://en.wikipedia.org/wiki/URL)

These websites also provide useful information:

* https://httpstatuses.com
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers



## Make someone

The following request allows you to create a person:

```http
POST /unrest/people/create HTTP/1.1
Content-Type: application/json
Location: comem-rest-demo.herokuapp.com

{
  "firstName": "John",
  "lastName": "Doe",
  "age": 20
}
```

What's not RESTful about the request and/or the response?



## Find someone

Make the following request to retrieve a person:

```http
GET /unrest/person/7 HTTP/1.1
Location: comem-rest-demo.herokuapp.com
```

Then make the following request to modify the person's first name:

```http
GET /unrest/person/7?updateFirstName=Bob HTTP/1.1
Location: comem-rest-demo.herokuapp.com
```

What's not RESTful or could be improved in the request and/or the response?



## Bad things

Make the following request to attempt to create a thing:

```http
POST /unrest/things HTTP/1.1
Location: comem-rest-demo.herokuapp.com

{}
```

Then make the following correct request:

```http
POST /unrest/things HTTP/1.1
Location: comem-rest-demo.herokuapp.com

{
  "name": "Some thing"
}
```

What's not RESTful or could be improved in the responses?



## People, people everywhere

The following request allows you to retrieve a list of people:

```http
GET /unrest/people HTTP/1.1
Location: comem-rest-demo.herokuapp.com
```

You can then filter this list by first name:

```http
GET /unrest/people/byFirstName/John HTTP/1.1
Location: comem-rest-demo.herokuapp.com
```

By last name:

```http
GET /unrest/people/byLastName/McDeere HTTP/1.1
Location: comem-rest-demo.herokuapp.com
```

Or by age:

```http
GET /unrest/people/byAge/35 HTTP/1.1
Location: comem-rest-demo.herokuapp.com
```

What could be improved in these requests?
