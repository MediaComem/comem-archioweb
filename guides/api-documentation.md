# Document a REST API

Your REST APIs should always be documented. Your users need to know:

* The purpose of your API and each operation in it.
* What HTTP requests can be made, including which parameters can be sent in the
  URL path, URL query parameters, headers and the request body. Parameter
  constraints, e.g. validations, should also be documented.
* What HTTP responses they will receive, including the status code and headers
  the response may have, and what will be in the response body.

They should know this by reading your documentation before ever having to test
your API. This will greatly improve their experience and understanding.

This guide suggests two ways to document a REST API: [OpenAPI/Swagger](#openapi)
and [apiDoc](#apidoc). These are [not the only ways](#alternatives), but they
are popular tools.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [OpenAPI](#openapi)
  - [What it looks like](#what-it-looks-like)
  - [Setup](#setup)
  - [Usage](#usage)
    - [Tips](#tips)
- [apiDoc](#apidoc)
  - [What it looks like](#what-it-looks-like-1)
  - [Setup](#setup-1)
    - [Using a configuration file](#using-a-configuration-file)
    - [Using apiDoc as a development dependency](#using-apidoc-as-a-development-dependency)
  - [Usage](#usage-1)
    - [Tips](#tips-1)
- [Alternatives](#alternatives)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## OpenAPI

The [OpenAPI specification][openapi-spec] is a community-driven open
specification within the [OpenAPI initiative][openapi]. It defines a standard,
programming language-agnostic interface description for HTTP APIs, which allows
both humans and computers to discover and understand the capabilities of a
service without requiring access to source code, additional documentation, or
inspection of network traffic.

[Swagger][swagger] is a suite of open source tools which can be used with an
OpenAPI document.

### What it looks like

An OpenAPI document is a [JSON][json] or [YAML][yaml] document which follows the
specification. Here's a short sample document which defines one API route (in
the YAML format):

```yml
openapi: 3.0.3
info:
  description: "This API is awesome."
  version: "1.0.0"
  title: "Awesome API"
paths:
  /users/{id}:
    get:
      summary: Request a user's information.
      parameters:
        - name: id
          in: path
          description: The unique identifier of the user.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                firstName:
                  type: string
                  description: First name of the user.
                  example: John
                lastName:
                  type: string
                  description: Last name of the user.
                  example: Doe
```

> Have a look at the [Swagger Editor][swagger-editor] for a more complete
> example.

Using tools such as [swagger-ui-express][swagger-ui-express], an [interactive
HTML documentation][example-openapi] can be generated from the OpenAPI document.

### Setup

Put your OpenAPI document in a `openapi.json` or `openapi.yml` file in your
repository, depending on whether you prefer JSON or YAML.

Install the [swagger-ui-express][swagger-ui-express] package in your Express
application, as well as the [js-yaml][js-yaml] package if you prefer writing
YAML rather than JSON:

```bash
$> cd /path/to/projects/my-project
$> npm install swagger-ui-express js-yaml
```

Add the following code to your `app.js` file, somewhere under the `const app =
express();` line:

```js
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
// Parse the OpenAPI document.
const openApiDocument = yaml.safeLoad(fs.readFileSync('./openapi.yml'));
// Server the Swagger UI documentation.
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiDocument));
```

### Usage

The [OpenAPI schema][openapi-schema] defines what you can put in an OpenAPI
document.

Be aware that when using [swagger-ui-express][swagger-ui-express], you are using
the [Swagger OpenAPI specification][swagger-spec]. You should use that as your
reference.

With the code above, the Swagger UI is kept automatically up to date every time
you launch your Express application.

> If you use [nodemon][nodemon] and have a `nodemon.json` configuration file,
> remember to add your `openapi.json` or `openapi.yml` file to the `watch` list
> in `nodemon.json`. This will make you application restart every time you
> modify the OpenAPI document.

#### Tips

* Use [components][openapi-components] to **avoid repeating yourself** if you
  have a chunk of your documentation that is the same for several routes.
* Document **validation constraints** by including [JSON schemas][json-schema]
  in your OpenAPI document. A JSON schema is a standard way of validating a JSON
  document. Use the [JSON Schema Reference][json-schema-reference] and the [JSON
  Schema Validation draft][json-schema-validation] as your references.



## apiDoc

[apiDoc][apiDoc] creates a user-friendly documentation page from API annotations
in your source code.

### What it looks like

Put comments such as this in your code:

```js
/**
 * @api {get} /users/:id Request a user's information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 */
```

The `apidoc` command-line tool will parse these comments and use them to
generate a [user-friendly HTML documentation][example-apidoc].

### Setup

Install apiDoc globally with:

```bash
$> npm install -g apidoc
```

Move into your project's directory and run apiDoc with two options:

* The `-i` option should be followed by the **directory containing your
  documented API routes**
* The `-o` option should be followed by the **directory where you want the
  generated documentation to be saved**

```bash
$> cd /path/to/projects/my-project
$> apidoc -i routes -o docs
warn: Please create an apidoc.json configuration file.
info: Done.
```

Open the generated `docs/index.html` file in your browser to see the result.

#### Using a configuration file

It's good practice to create an `apidoc.json` file in your project's directory
to configure some documentation properties:

```json
{
  "name": "My project",
  "version": "1.0.0",
  "description": "It is awesome",
  "title": "My project",
  "url" : "https://example.com"
}
```

This will get rid of the `Please create an apidoc.json configuration file`
warning when you run apiDoc.

#### Using apiDoc as a development dependency

You can also install and run apiDoc as a development dependency:

```bash
$> npm install --save-dev apidoc
```

Add an `apidoc` script to your `package.json` file:

```json
{
  "name": "my-project",
  "scripts": {
    "apidoc": "apidoc -i routes -o docs",
    "...": "..."
  },
  "...": "..."
}
```

You and your teammates can now generate the documentation this way,
without having to install the module globally on each machine:

```bash
$> npm run apidoc
```

### Usage

Read the apiDoc documentation, namely the [parameters][apidoc-params] you can
use to document each route.

You will have to run the `apidoc` command or your `npm run apidoc` script every
time you modify an apiDoc comment.

#### Tips

* It is customary to put an apiDoc comment next to the route it documents, but
  you can actually put it anywhere in your project.
* Use `@apiGroup` to **group routes together** in the left-side menu.
* Use `@apiDefine` and `@apiUse` to **avoid repeating yourself** if you have a
  chunk of documentation that is the same for several routes.
* Document **validation constraints** with the `@apiParam` parameter:

  ```js
  /**
   * @apiParam (URL query parameters) {Number{1..}} [page] The page to retrieve
   * @apiParam (Request body) {String{3..50}} title The movie's title
   * @apiParam (Request body) {Number{0..10}} [rating] The movie's rating
   * @apiParam (Request body) {String="male","female"} gender The person's gender
   */
  ```
* Specify a category in parenthese when using the `@apiParam` parameter in order
  to group request/response parameters together. For example:

  ```js
  /**
   * @apiParam (URL path parameters) {String} id The movie's unique identifier
   * @apiParam (URL query parameters) {Number} page The page to retrieve
   * @apiParam (Request body) {String} title The movie's title
   * @apiParam (Request body) {Number} rating The movie's rating
   */
  ```



## Alternatives

* Plain [Markdown][markdown]
* [Slate][slate] (Markdown)
* [RAML][raml] (YAML)



[apiary]: https://apiary.io
[apidoc]: http://apidocjs.com
[apidoc-params]: https://apidocjs.com/#params
[example-apidoc]: https://comem-rest-demo.herokuapp.com
[example-openapi]: https://comem-rest-demo.herokuapp.com/swagger/
[js-yaml]: https://www.npmjs.com/package/js-yaml
[json]: https://www.json.org
[json-schema]: https://json-schema.org
[json-schema-reference]: http://json-schema.org/understanding-json-schema/reference/
[json-schema-validation]: https://json-schema.org/draft/2019-09/json-schema-validation.html
[markdown]: https://daringfireball.net/projects/markdown/syntax
[node]: https://nodejs.org/
[nodemon]: https://www.npmjs.com/package/nodemon
[openapi]: https://www.openapis.org
[openapi-components]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#componentsObject
[openapi-schema]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#schema
[openapi-spec]: https://github.com/OAI/OpenAPI-Specification
[raml]: https://raml.org
[slate]: https://github.com/lord/slate
[swagger]: https://swagger.io
[swagger-editor]: https://editor.swagger.io
[swagger-spec]: https://swagger.io/specification/
[swagger-ui-express]: https://www.npmjs.com/package/swagger-ui-express
[yaml]: https://yaml.org
