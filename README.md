# COMEM+ Web-Oriented Architecture Course

The goal of this course is to learn about the generic concept of **web
service**, focusing on **REST**ful APIs as one way to expose such a service. You
will:

- Learn the **core principles** of the REST architectural style.
- Learn how to **implement** a REST API in JavaScript with Node.js.
- **Deploy** your REST API on a cloud application platform.
- Write **documentation** and **automated tests** for your REST API.

This course is a [COMEM+][comem] web development course taught at
[HEIG-VD][heig].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Plan](#plan)
- [What you will need](#what-you-will-need)
- [Useful links](#useful-links)
- [Evaluation](#evaluation)
  - [Delivery](#delivery)
- [Project Roadmap](#project-roadmap)
  - [Week 1](#week-1)
  - [Week 2](#week-2)
  - [Week 3](#week-3)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Plan

- [Introduction](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/course?home=MediaComem%2Fcomem-archioweb%23readme)

- Basics
  - [HTTP & REST introduction](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/rest?home=MediaComem%2Fcomem-archioweb%23readme)
    - [_Exercise_](./exercises/rest.md)
  - [_Extra:_ JavaScript](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/js?home=MediaComem%2Fcomem-archioweb%23readme)
    - [_Exercises_](./exercises/javascript.md) (🔑
      [**solutions**](./exercises/javascript-solutions.md))
    - [_Extra:_ promises](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/js-promises?home=MediaComem%2Fcomem-archioweb%23readme)
    - [_Extra:_ prototypes](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/js-prototypes?home=MediaComem%2Fcomem-archioweb%23readme)
    - [_Extra:_ classes](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/js-classes?home=MediaComem%2Fcomem-archioweb%23readme)
    - [_Extra:_ modules](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/js-modules?home=MediaComem%2Fcomem-archioweb%23readme)
    - [_Extra:_ closures](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/js-closures?home=MediaComem%2Fcomem-archioweb%23readme)
  - [Node.js](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/node?home=MediaComem%2Fcomem-archioweb%23readme) JavaScript runtime
    - [_Exercises_](./exercises/node.md) (🔑
      [**solutions**](./exercises/node-solutions))
  - [npm](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/npm?home=MediaComem%2Fcomem-archioweb%23readme) Node.js package manager

- Creating a web service
  - [Express](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/express?home=MediaComem%2Fcomem-archioweb%23readme) web framework
    - [_Exercises_](https://express.archioweb.ch)
  - [MongoDB](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/mongodb?home=MediaComem%2Fcomem-archioweb%23readme) document-oriented database
    - [_Guide:_ install MongoDB](./guides/install-mongodb.md)
    - [_Reference:_ data modeling](https://www.mongodb.com/docs/manual/data-modeling/) (embedding vs. referencing)
  - [Mongoose](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/mongoose?home=MediaComem%2Fcomem-archioweb%23readme) Object-Document Mapper
    - [_Guide:_ store geospatial data with Mongoose](./guides/store-geospatial-data.md)

- Deploying your web service
  - [_Guide:_ deploy an Express.js application with Render & MongoDB Atlas](./guides/deploy-in-the-cloud.md)

- Creating a REST API
  - [REST in depth](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/rest-advanced?home=MediaComem%2Fcomem-archioweb%23readme)
    - [_Exercises_](./exercises/unrest.md)
  - [Express best practices](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/express-best-practices?home=MediaComem%2Fcomem-archioweb%23readme)
  - [Utilizing Mongoose](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/express-mongoose?home=MediaComem%2Fcomem-archioweb%23readme) in Express (filtering, pagination, aggregation)
  - [Express Authentication](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/express-auth?home=MediaComem%2Fcomem-archioweb%23readme)

- Documenting and testing a REST API
  - [_Guide:_ document a REST API](./guides/api-documentation.md)
  - [Automated Testing](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/automated-testing?home=MediaComem%2Fcomem-archioweb%23readme)
    - [_Guide:_ set up automated tests for an Express.js REST API](./guides/set-up-automated-tests.md)

- _Extras_
  - [_Guide:_ the many worlds of asynchronous JavaScript](./guides/async-js.md)

## What you will need

- A Unix CLI (WSL on Windows)
- [Git][git-downloads]
- A free [GitHub][github] account
- [Google Chrome][chrome] (recommended, any browser with developer tools will do)
- [Node.js][node] 26 (22 and 24 also work)
- [Postman][postman] (recommended, any tool that makes raw HTTP requests will do)
- [MongoDB][mongodb] 8.0 (not 9)
- A free [Render][render] account

## Useful links

**Documentation**

- [Demonstration REST API implemented with Express][demo-api] ([OpenAPI documentation][demo-api-openapi])
- Express API example written during class (_coming soon_)
- [Project suggestions](PROJECTS.md)
- [Architecture & source code management diagrams][diagrams]

**Other**

- [Command line cheatsheet][cli-cheatsheet]
- [Git cheatsheet][git-cheatsheet]

## Evaluation

**REST API**

Your REST API must be developed with the [Express][express] framework and use a
[MongoDB][mongodb] database. It must fulfill the following criteria:

- The API must provide **user management**:
  - New users must be able to **register**.
  - Existing users must be able to **authenticate** (to allow users to log in).
- The API must provide at least **2 other types** of resources:
  - Both types must be linked together (e.g. aggregation or composition).
  - At least one of the types must be linked to users.
  - The API must provide minimal CRUD operations to manage and use those types
    in a mobile application.
- The API must use the knowledge learned during the course:
  - At least one resource must be a **paginated list**.
  - At least one resource must be a **list with optional filters**.
  - At least one resource must provide **aggregated data** from other resources
    using a [MongoDB aggregation pipeline][mongodb-aggregation] (e.g. the number
    of items created by a user).

  - Sensitive operations must be protected by requiring valid
    **authentication** and performing **authorization**:
    - Authentication must be provided in the form of a [JWT token][jwt] or an
      equivalent mechanism.
    - You must define who is authorized to perform which operations on which
      resources, and enforce these permissions. These restrictions must make
      sense in the context of your domain model. For example, a user may not be
      authorized to update a resource created by another user, even when
      authenticated.

      There must be at least one operation in the API which limits the
      permissions of authenticated users.

- The API must have a significant real-time component that is properly
  integrated with the rest of the code. Developing this real-time component will
  be done in the Développement Mobile course.

You can (but are not required to) design your REST API around mobile features,
for example:

- **Geolocation:** see [Store geospatial data with
  Mongoose](./guides/store-geospatial-data.md) for information on how to store
  geospatial data in MongoDB and query it with Mongoose
- **Pictures**
- **Audio/Video**
- **Accelerometer**

**Infrastructure**

- The source code of your REST API must be in a repository on GitHub.
- Your REST API must be deployed on Render.

**Documentation**

- Your REST API must be documented.

  By reading the documentation, a user must know in advance (before testing the
  API and without reading the code) which requests can be made, what can be sent
  in each request (URL path parameters, headers and/or body, and their
  validation constraints, if any), and what responses can be expected from the
  API (status code, headers and/or body).

  You do not have to document the 500 Internal Server Error response, which is
  considered to always be a possible response to any request.

**Automated testing**

- You must implement **automated tests** to test your REST API:
  - Your test suite must reach at least **75% code coverage**, with properly
    written tests. Note that we will not evaluate pure coverage numbers, but
    rather the quality of your tests.
  - Your tests must cover **all types of REST operations** in your API (for
    example: create thing, update thing, list things, delete thing).
  - Your tests must not cover only the "happy path" (i.e. successful requests),
    but also **error cases**.
  - Each of your tests must exercise only one REST operation, to remain focused,
    independent of other operations, and to avoid excessive code duplication.
  - Your tests must be **reproducible** (running `npm test` several times in a
    row should always pass and produce the same results).

**Quality of the implementation**

- You must follow REST best practices:
  - Your REST resources must use appropriate HTTP methods, headers and status
    codes.
  - Your REST resources must have an appropriate and consistent URL hierarchy
    and/or naming structure.
- Your asynchronous code must be correct.
- Your Express routes must handle asynchronous operation errors.
- You must avoid excessive code duplication (e.g. using Express middleware).
- Your API must have basic validations on user input (e.g. using Mongoose
  validations).
- Your API must validate the existence of linked resources (e.g. when creating
  an item linked to a user).

### Delivery

Send an e-mail _no later than **[TO BE DETERMINED]**_ to Simon Oulevay & Loris
Gavillet with:

- The list of group members.
- The link to your source code repository on GitHub.
- The link to your deployed REST API on Render.

## Project Roadmap

This course is structured in such a way that it will feel very heavy in new theory during the first month. Indeed, there are plenty of concepts which you will need to grasp before fully commiting to the term project. Nevertheless, this is first and foremost a practical course. Our goal is for you to be able to **apply** the concepts which we will discuss in class. In order to avoid losing sight of this fact during these first few weeks of the semester, we suggest you get going immediately with the project.

### Week 1

**Get in a team!**

The term project will be built in groups of 3 or 4, so try and get together as early as possible. We also suggest you mix it up: try working with people you've never worked with before.

**Communicate!**

Team formation is your responsibility. Be friendly and respectful during the process. If you feel disappointed, talk it out with your partners. The best way to resolve conflicts is to avoid them in the first place. A good place to start is to set ground rules. Make sure every team member feels heard by – for example – setting a list of each and everyone's needs:

- Anna: _I need to be able to talk. Please do not interrupt me_.
- Bijan: _I feel insecure about my code. Please be extra gentle when you are reviewing it_.
- Charlene: _I need to use sarcasm, it's my way of communicating. Please do your best to not feel offended, it's nothing personal._

**Brainstorm**

By the end of the first class, you should have a rough idea of what an API is and what we are looking for in your projects. On this basis, start having discussions about what could be interesting, useful or fun. Nothing is set in stone at this point, but having a few ideas in the back of your mind will help you add context to the lectures.

### Week 2

**JavaScript reviews**

Make sure you do the assigned exercises. Help each other out so that everyone in your group has these basics covered. Everyone must code!

**Consume APIs**

To get a better grasp of how APIs work and why they are useful, it's a good idea to try to consume them. There are many open APIs, so explore the [Public APIs List](https://github.com/public-apis/public-apis) and try getting data back from a couple different sources. To do so, you can already get going with [Postman](https://www.postman.com/), an API testing tool we will be discussing later in the semester. They have an excellent set of video tutorials. You could also use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) which you might have seen in ProgWeb.

The list is huge, so you might stumble onto something that is broken or poorly designed. If you can't make it work, try again. If that still doesn't work, move on.

### Week 3

**Decision Time**

Now is a good time to really decide what the team's project will be. Remember, the API you design in this course will almost certainly be the foundation for your front-end project in DevMobil, so every team member should feel some ownership for the idea.

**Get Specific**

A good way to transition from ideation to development is to write down an intention document for the project. This document will serve as a foundation for your work and should address the following:

- General questions
  - What are we building, **in one sentence**?
  - Why are we building it?
  - Who will use it?
  - What is it called?
- Specific questions
  - How will we build it?
  - How will our team operate? Are there specific roles?
  - What are our different ressources?
  - What endpoints are we going to use?

**Divide and conquer**

Even if you can't anticipate everything that you will need to complete for the project to work, try dividing the work into manageable tasks.

For example, a task like _Implement authentication_ could be divided in the following way:

- Design the endpoints
- Add password hashing to the user model
- Implement token-generating endpoint
- Implement token-based authorization middleware
- Write tests
- Refactor

You can be as granular as you want in the way you divide and define tasks. You can then assign tasks to people in your team.

**Week 4 and the following weeks will be almost wholly dedicated to the developement of your API.**

## References

These are the main references used throughout this course. More detailed and
additional links to various online articles and documentation can be found at
the end of each subject.

- [Mozilla Developer Network](https://developer.mozilla.org)
  - [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
    - [A Re-Introduction to JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
    - [Inheritance and the Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
    - [Introducing JavaScript Objects](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects)
- [Learn Node](https://nodejs.dev/learn)
- [npm CLI Documentation](https://docs.npmjs.com/cli-documentation/)
- [Architectural Styles and the Design of Network-based Software Architectures - Roy Thomas Fielding](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)
- [Internet Engineering Task Force](https://www.ietf.org)
  - [RFC 2616 - Hypertext Transfer Protocol - HTTP/1.1](https://tools.ietf.org/html/rfc2616)
  - [RFC 5789 - PATCH Method for HTTP](https://tools.ietf.org/html/rfc5789)
  - [RFC 8288 - Web Linking](https://tools.ietf.org/html/rfc8288)
- [HTTP Status Codes](https://httpstatuses.com)
- [Express Documentation](http://expressjs.com)
- [Functional Design Patterns for Express.js - Jonathan Lee Martin](https://pragprog.com/titles/d-jmexpress/functional-design-patterns-for-express-js/)
- [Standards.REST](https://standards.rest)
- [Richardson Maturity Model - Leonard Richardson, Martin Fowler](https://martinfowler.com/articles/richardsonMaturityModel.html)
- [MongoDB Documentation](https://www.mongodb.com/docs/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/index.html)
- [Auth0](https://auth0.com)
  - [Introduction to JSON Web Tokens](https://jwt.io/introduction/)
  - [Token Based Authentication Made Easy](https://auth0.com/learn/token-based-authentication-made-easy/)
- [Render Documentation](https://render.com/docs)

[chrome]: https://www.google.com/chrome/
[cli-cheatsheet]: https://archidep.ch/cheatsheets/command-line/
[comem]: http://www.heig-vd.ch/comem
[cordova-plugins]: https://cordova.apache.org/docs/en/latest/#plugin-apis
[demo-api]: https://github.com/MediaComem/comem-rest-demo
[demo-api-openapi]: https://demo.archioweb.ch/docs/openapi
[diagrams]: diagrams.pdf
[express]: https://expressjs.com
[git-cheatsheet]: https://archidep.ch/cheatsheets/git/
[git-downloads]: https://git-scm.com/downloads
[github]: https://github.com
[hal]: https://en.wikipedia.org/wiki/Hypertext_Application_Language
[render]: https://www.render.com
[heig]: http://www.heig-vd.ch
[json-api]: https://jsonapi.org
[jwt]: https://jwt.io/
[mongodb]: https://www.mongodb.com
[mongodb-aggregation]: https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
[node]: https://nodejs.org/
[postman]: https://www.postman.com
