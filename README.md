# COMEM+ Web-Oriented Architecture Course

The goal of this course is to learn about the generic concept of **web
service**, focusing on **REST**ful APIs as one way to expose such a service. You
will:

* Learn the **core principles** of the REST architectural style.
* Learn how to **implement** a REST API in JavaScript with Node.js.
* **Deploy** your REST API on a cloud application platform.
* Add a **real-time** component to your REST API with WebSockets.

This course is a [COMEM+][comem] [web development course][comem-webdev] taught at [HEIG-VD][heig].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Plan](#plan)
- [What you will need](#what-you-will-need)
- [Useful links](#useful-links)
- [Evaluation](#evaluation)
  - [Delivery](#delivery)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Plan

* [Introduction](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/course?home=MediaComem%2Fcomem-archioweb%23readme)

* Basics
  * [JavaScript](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/js?home=MediaComem%2Fcomem-archioweb%23readme)
  * [Node.js](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/node?home=MediaComem%2Fcomem-archioweb%23readme) JavaScript runtime
  * [npm](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/npm?home=MediaComem%2Fcomem-archioweb%23readme) Node.js package manager
  * [HTTP & REST introduction](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/rest?home=MediaComem%2Fcomem-archioweb%23readme)

* Creating a web service
  * [Express](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/express?home=MediaComem%2Fcomem-archioweb%23readme) web framework
  * [MongoDB](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/mongodb?home=MediaComem%2Fcomem-archioweb%23readme) document-oriented database
  * [Mongoose](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/mongoose?home=MediaComem%2Fcomem-archioweb%23readme) Object-Document Mapper

* Deploying your web service
  * [Heroku](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/heroku?home=MediaComem%2Fcomem-archioweb%23readme) cloud application platform

* Creating a REST API
  * [REST in depth](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/rest-advanced?home=MediaComem%2Fcomem-archioweb%23readme)
  * [Express best practices](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/express-best-practices?home=MediaComem%2Fcomem-archioweb%23readme)
  * [Utilizing Mongoose](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/express-mongoose?home=MediaComem%2Fcomem-archioweb%23readme) in Express (filtering, pagination, aggregation)
  * [Express Authentication](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/express-auth?home=MediaComem%2Fcomem-archioweb%23readme)
  * [REST API documentation](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/apidoc?home=MediaComem%2Fcomem-archioweb%23readme) with apiDoc
  * [Writing API tests](AUTOMATED-TESTING.md)

* Real-time communication
  * [WebSockets](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/ws?home=MediaComem%2Fcomem-archioweb%23readme)
  * [*Extra: Web Application Messaging Protocol (WAMP)*](https://mediacomem.github.io/comem-archioweb/2020-2021/subjects/wamp?home=MediaComem%2Fcomem-archioweb%23readme)



## What you will need

* A Unix CLI (Git Bash is included with Git on Windows)
* [Git][git-downloads]
* A free [GitHub][github] account
* [Google Chrome][chrome] (recommended, any browser with developer tools will do)
* [Node.js][node] 12+
* [Postman][postman] (recommended, any tool that makes raw HTTP requests will do)
* [MongoDB][mongodb]
* A free [Heroku][heroku] account
* The [Heroku CLI][heroku-cli]
* [A WebSocket web client][msg-central]



## Useful links

**Documentation**

* [Architecture & source code management diagrams][diagrams]
* [Demonstration REST API implemented with Express][demo-api] ([documentation][demo-api-doc])
* [Project suggestions](PROJECTS.md)

**Exercises**

* [Tic-Tac-Toe Real-Time Exercise][tictactoe]

**Guides**

* [Storing geospatial data with Mongoose](MONGOOSE-GEOSPATIAL.md)
* [Setting up automated testing for an Express.js REST API](AUTOMATED-TESTING.md)
* [The many worlds of asynchronous JavaScript](ASYNC-JS.md)
* [Command line cheatsheet][cli-cheatsheet]
* [Git cheatsheet][git-cheatsheet]



## Evaluation

**API**

Your REST API must be developed with the [Express][express] framework and use a
[MongoDB][mongodb] database. It must provide (at least):

* The API must provide **user management**:
  * New users must be able to **register**.
  * Existing users must be able to **authenticate** (to allow users to log in).
* The API must provide at least **2 other types** of resources:
  * Both types must be linked together (e.g. aggregation or composition).
  * At least one of the types must be linked to users.
  * The API must provide minimal CRUD operations to manage and use those types in a mobile application.
* The API must use the knowledge learned during the course:
  * At least one resource must be a **paginated list**.
  * At least one resource must be a **list with optional filters**.
  * At least one resource must provide **aggregated data** from other resources using a [MongoDB aggregation pipeline][mongodb-aggregation]
    (e.g. the number of items created by a user).
  * The API must be developed as a backend to a mobile application
    using at least 2 [**mobile hardware features**][cordova-plugins], for example:
    * At least one resource must be **geolocated**.

      > See [Storing geospatial data with Mongoose](MONGOOSE-GEOSPATIAL.md) for
      > information on how to store this data.
    * At least one resource must have one or multiple **pictures**
      (it is sufficient to store a picture URL or URLs in the database).
  * Sensitive operations must be protected by requiring valid **authentication**.
    * Authentication must be provided in the form of a [JWT token][jwt] or an equivalent mechanism.
* The API must have a real-time pub-sub component:
  * *One or the other* of the following must be provided:
    * A `ws://` or `wss://` endpoint to which a plain WebSockets client can connect to receive real-time messages.
    * A WAMP pub-sub topic to which a Subscriber can subscribe to receive real-time messages.
  * The WebSockets endpoint or WAMP topic must send real-time messages containing relevant data for the application.
    (For example, a chat application may notify its clients in real-time of the number of channels, messages, etc, to display activity on the home page.)
  * The WebSockets endpoint or WAMP topic may be unprotected (i.e. implementing authentication or authorization is mandatory).

**Infrastructure**

* The source code of your REST API must be in a repository on GitHub.
* Your REST API must be deployed on Heroku.

**Documentation**

* Your REST API must be documented.
* The real-time component of your API must be documented (not necessarily in the same way).

**Automated testing**

* You must implement **automated tests** to test your REST API:
  * You must write tests for **at least 4 separate REST operations** in your API
    (for example: create thing, update thing, list things, delete thing). One
    test for each operation is enough.

    > A test for a `GET` request that retrieves an empty list does not count in
    > the minimal number of tests you must write.
  * Your tests must be **reproducible** (running `npm test` several times in a
    row should always produce the same result).

**Quality of the implementation**

* You must follow REST best practices:
  * Your REST resources must use appropriate HTTP methods, headers and status codes.
  * Your REST resources must have a consistent URL hierarchy and/or naming structure.
* Your asynchronous code must be correct.
* Your Express routes must handle asynchronous operation errors.
* You must avoid excessive code duplication (e.g. using Express middleware).
* Your API must have basic validations on user input (e.g. using Mongoose validations).
* Your API must validate the existence of linked resources (e.g. when creating an item linked to a user).

**Bonus**

Doing more than is required **MAY** earn you some bonus points in the
evaluation if implemented correctly. Here are some examples:

* Implement authorization, i.e. deny some users the right to perform specific
  operations even when they are authenticated.

  For example: event when authenticated, user A may not be able to edit resource
  1, because it was created by user B, and only the creator can modify it.
* Implement "full" (90-100%) test coverage with automated tests.



### Delivery

Send an e-mail *no later than __November 9th 2020__* to Simon Oulevay with:

* The list of group members.
* The link to your source code repository on GitHub.
* The link to your deployed REST API on Heroku.



## References

These are the main references used throughout this course. More detailed and
additional links to various online articles and documentation can be found at
the end of each subject.

* [Mozilla Developer Network](https://developer.mozilla.org)
  * [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
    * [A Re-Introduction to JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
    * [Inheritance and the Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
    * [Introducing JavaScript Objects](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects)
* [Learn Node](https://nodejs.dev/learn)
* [npm CLI Documentation](https://docs.npmjs.com/cli-documentation/)
* [Architectural Styles and the Design of Network-based Software Architectures - Roy Thomas Fielding](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)
* [Internet Engineering Task Force](https://www.ietf.org)
  * [RFC 2616 - Hypertext Transfer Protocol - HTTP/1.1](https://tools.ietf.org/html/rfc2616)
  * [RFC 5789 - PATCH Method for HTTP](https://tools.ietf.org/html/rfc5789)
  * [RFC 8288 - Web Linking](https://tools.ietf.org/html/rfc8288)
* [HTTP Status Codes](https://httpstatuses.com)
* [Express Documentation](http://expressjs.com)
* [Functional Design Patterns for Express.js - Jonathan Lee Martin](https://pragprog.com/titles/d-jmexpress/functional-design-patterns-for-express-js/)
* [Standards.REST](https://standards.rest)
* [Richardson Maturity Model - Leonard Richardson, Martin Fowler](https://martinfowler.com/articles/richardsonMaturityModel.html)
* [MongoDB Documentation](https://docs.mongodb.com)
* [Mongoose Documentation](https://mongoosejs.com/docs/index.html)
* [Auth0](https://auth0.com)
  * [Introduction to JSON Web Tokens](https://jwt.io/introduction/)
  * [Token Based Authentication Made Easy](https://auth0.com/learn/token-based-authentication-made-easy/)
* [Heroku Dev Center](https://devcenter.heroku.com)



[chrome]: https://www.google.com/chrome/
[cli-cheatsheet]: https://github.com/MediaComem/comem-webdev/blob/master/CLI-CHEATSHEET.md
[comem]: http://www.heig-vd.ch/comem
[comem-webdev]: https://github.com/MediaComem/comem-webdev
[cordova-plugins]: https://cordova.apache.org/docs/en/latest/#plugin-apis
[demo-api]: https://github.com/MediaComem/comem-webdev-express-rest-demo
[demo-api-doc]: https://mediacomem.github.io/comem-webdev-express-rest-demo/
[diagrams]: diagrams.pdf
[express]: https://expressjs.com
[git-cheatsheet]: https://github.com/MediaComem/comem-webdev/blob/master/GIT-CHEATSHEET.md
[git-downloads]: https://git-scm.com/downloads
[github]: https://github.com
[heroku]: https://www.heroku.com/home
[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli
[heig]: http://www.heig-vd.ch
[jwt]: https://jwt.io/
[mongodb]: https://www.mongodb.com
[mongodb-aggregation]: https://docs.mongodb.com/manual/core/aggregation-pipeline/
[msg-central]: https://msg-central.herokuapp.com
[node]: https://nodejs.org/
[postman]: https://www.getpostman.com
[tictactoe]: https://github.com/MediaComem/comem-archioweb-tictactoe
