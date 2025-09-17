# Document a REST API

Your REST APIs should always be documented. Your users need to know:

- The purpose of your API and each operation in it.
- What HTTP requests can be made, including which parameters can be sent in the
  URL path, URL query parameters, headers and the request body. Parameter
  constraints, e.g. validations, should also be documented.
- What HTTP responses they will receive, including the status code and headers
  the response may have, and what will be in the response body.

They should know this by reading your documentation before ever having to test
your API. This will greatly improve their experience and understanding.

We require that you document your API with [OpenAPI/Swagger](#openapi), the
standard for documenting REST APIs. This is [not the only
solution](#alternatives), but it is the standard and most popular tool for this
purpose.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [OpenAPI](#openapi)
  - [What it looks like](#what-it-looks-like)
  - [Setup](#setup)
  - [Usage](#usage)
    - [Tips](#tips)
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
openapi: 3.1.0
info:
  description: 'This API is awesome.'
  version: '1.0.0'
  title: 'Awesome API'
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

Add the following code in the imports section of your `app.js` file:

```js
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
```

And the following code somewhere under the `const app =
express();` line:

```js
// Parse the OpenAPI document.
const openApiDocument = yaml.load(fs.readFileSync('./openapi.yml'));
// Serve the Swagger UI documentation.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
```

You should now be able to access your documentation through the Swagger UI at
`localhost:3000/api-docs`

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

- Use [components][openapi-components] to **avoid repeating yourself** if you
  have a chunk of your documentation that is the same for several routes.
- Document **validation constraints** by including [JSON schemas][json-schema]
  in your OpenAPI document. A JSON schema is a standard way of validating a JSON
  document. Use the [JSON Schema Reference][json-schema-reference] and the [JSON
  Schema Validation draft][json-schema-validation] as your references.
- The [swagger-jsdoc][swagger-jsdoc] package allows you to put each route's
  documentation in a comment next to the route if that's your thing.

## Alternatives

OpenAPI has become the standard so we require you to write your documentation
with it, but for your information, there are alternatives:

- Plain [Markdown][markdown]
- [Slate][slate] (Markdown)
- [RAML][raml] (YAML)

[apiary]: https://apiary.io
[example-openapi]: https://demo.archioweb.ch/docs/openapi
[express-static]: https://expressjs.com/en/starter/static-files.html
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
[swagger-jsdoc]: https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md
[swagger-spec]: https://swagger.io/specification/
[swagger-ui-express]: https://www.npmjs.com/package/swagger-ui-express
[yaml]: https://yaml.org
