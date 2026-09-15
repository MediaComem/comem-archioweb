# Node.js exercises

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Show the current time](#show-the-current-time)
- [List the current directory](#list-the-current-directory)
- [Calculator](#calculator)
- [Notoriously psychedelic modules](#notoriously-psychedelic-modules)
- [Yell](#yell)
- [A tiny HTTP API](#a-tiny-http-api)
  - [Step 1: say hello](#step-1-say-hello)
  - [Step 2: greet someone](#step-2-greet-someone)
  - [Step 3: anything else is a 404](#step-3-anything-else-is-a-404)
  - [Hints](#hints)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Show the current time

Write a `now.mjs` script that prints the current date and time to your console
when executed:

```bash
$> node now.mjs
Tue Sep 15 2026 11:00:31 GMT+0200 (Central European Summer Time)
```

## List the current directory

Write a `list.mjs` script that lists the contents of the directory where it is
executed, using the **promise-based** file system module:

```js
import fs from 'node:fs/promises';
```

Since an ECMAScript module can `await` at the top level, you do not need to wrap
anything in an `async` function.

Here's how the output could look like, but of course it will depend on what
files are on your machine and which directory you list:

```bash
$> node list.mjs
Applications Documents Downloads Music ...

$> cd Downloads

$> node list.mjs
cat.jpg more-cats.png
```

**Bonus:** update the script so that it ignores "hidden" files following the
Unix convention (i.e. files with a name starting with a "dot" `.` character are
hidden):

```bash
$> ls -a
. .. some-file.txt .hidden-file

$> node list.mjs
some-file.txt
```

> **Hint:** if you don't have any directory with hidden files, you can easily
> create an empty hidden file with the command `touch .hidden-file`.

You may find the following documentation useful:

- [`fs.readdir`](https://nodejs.org/docs/latest-v26.x/api/fs.html#fspromisesreaddirpath-options)
- [`process.cwd()`](https://nodejs.org/docs/latest-v26.x/api/process.html#processcwd)
  — the directory the script was **executed from**

## Calculator

Save the following contents to a file named `calculate.mjs`:

```js
import { add, multiply } from './calculator/simple.mjs';
import { pow } from './calculator/advanced.mjs';

console.log(`2 added to 1 is: ${add(1, 2)}`);
console.log(`2 multiplied by 3 is: ${multiply(2, 3)}`);
console.log(`2 to the power of 10 is: ${pow(2, 10)}`);
```

Write the missing files so that the following command works:

```bash
$> node calculate.mjs
2 added to 1 is: 3
2 multiplied by 3 is: 6
2 to the power of 10 is: 1024
```

You may find the [`Math.pow`
function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
helpful.

## Notoriously psychedelic modules

Write a `unique.js` script which takes any number of arguments and prints each
unique argument on one line.

Use the [Lodash](https://lodash.com) library to accomplish this. The goal of
this exercise is to install and use a third-party library that is not provided
out of the box with Node.js, using the npm package manager.

Set the project up the way you now know how, in a new directory:

```bash
$> npm init
```

Answer **`module`** to the `type:` question, so that `import` works in plain
`.js` files and you do not need the `.mjs` extension any more.

The resulting script should behave like this:

```bash
$> node unique.js 1 2 4 3 2 3 5 6 4 4
1
2
4
3
5
6

$> node unique.js Hello Bob Hello Alice
Hello
Bob
Alice
```

> You could of course implement the detection of unique values yourself, but
> that is not the purpose of this particular exercise.

To complete this exercise:

- Create the project with `npm init` and install Lodash as a **dependency**.
- Find the appropriate Lodash function.
- Write your script.

> Check your `package.json` afterwards: it should list `lodash` under
> `dependencies`, and there should be a `package-lock.json` next to it.

You may find the following documentation useful:

- [Lodash](https://lodash.com)
- [Lodash's documentation](https://lodash.com/docs/4.18.1)
- [`process.argv`](https://nodejs.org/docs/latest-v26.x/api/process.html#processargv)
- [Theory on npm](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/npm/?home=MediaComem%2Fcomem-archioweb%23readme#1)

## Yell

Create a Node.js command line script named `yell.mjs` which:

- Takes one file name as an argument.
- Reads the file with the UTF-8 encoding, using `node:fs/promises` and `await`.
- Converts the contents of the file to uppercase.
- Outputs the converted contents.

The expected behavior should be:

```bash
$> cat rainbow.txt
Somewhere over the rainbow
Way up high
...

$> node yell.mjs rainbow.txt
SOMEWHERE OVER THE RAINBOW
WAY UP HIGH
...
```

Here's some text you may save to the file `rainbow.txt`:

```
Somewhere over the rainbow
Way up high
There's a land that I heard of
Once in a lullaby

Somewhere over the rainbow
Skies are blue
And the dreams that you dare to dream
Really do come true

Someday I'll wish upon a star
And wake up where the clouds are far
Behind me
Where troubles melt like lemon drops
Away above the chimney tops
That's where you'll find me

Somewhere over the rainbow
Bluebirds fly
Birds fly over the rainbow
Why then, oh why can't I?

If happy little bluebirds fly
Beyond the rainbow
Why, oh why can't I?
```

**Bonus:** the file may not exist. Handle that error so that the script prints a
readable message instead of an unhandled rejection and a stack trace.

You may find the following documentation useful:

- [`process.argv`](https://nodejs.org/docs/latest-v26.x/api/process.html#processargv)
- [`fsPromises.readFile`](https://nodejs.org/docs/latest-v26.x/api/fs.html#fspromisesreadfilepath-options)
- [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)

> If you are curious about how this was written before promises, the callback
> version of `fs.readFile` is in the
> [appendix](https://mediacomem.github.io/comem-archioweb/2026-2027/subjects/node/?home=MediaComem%2Fcomem-archioweb%23readme#appendix-nodejs-callbacks)
> of the Node.js subject.

## A tiny HTTP API

Write a `server.mjs` script that starts an **HTTP server on port 3000** with the
`node:http` core module, and answers **JSON**. This is the same job Express will
do for you next week — doing it by hand once makes it obvious what Express
actually removes.

Start the server like this, and leave it running while you work:

```bash
$> node --watch server.mjs
Server listening on http://localhost:3000
```

> `--watch` restarts the server every time you save the file, so you never have
> to stop and start it yourself.

**Test every step with Postman**, the way you did with public APIs: create a
request, send it, then check the **status code**, the **`Content-Type` header**
and the **body** of the response.

### Step 1: say hello

`GET http://localhost:3000/hello` must answer with status **`200 OK`**, the
header **`Content-Type: application/json`**, and this body:

```json
{ "greeting": "Hello, World!" }
```

Postman will display the response as formatted JSON. If it shows you plain text
instead, your `Content-Type` header is missing or wrong.

### Step 2: greet someone

`GET http://localhost:3000/hello?name=Alice` must answer:

```json
{ "greeting": "Hello, Alice!" }
```

Without the `name` parameter, it must still answer `Hello, World!`. In Postman,
add `name` in the **Params** tab rather than typing it into the URL by hand.

### Step 3: anything else is a 404

Any other URL, for example `GET http://localhost:3000/goodbye`, must answer with
status **`404 Not Found`** and this body:

```json
{ "error": "Not found" }
```

**Bonus:** send `POST http://localhost:3000/hello` from Postman. Make it answer
**`405 Method Not Allowed`** with `{ "error": "Method not allowed" }`, while
`GET` on the same path keeps working.

### Hints

- `req.method` is the HTTP method (`'GET'`, `'POST'`, ...) and `req.url` is the
  path **with** the query string (e.g. `/hello?name=Alice`).
- The easiest way to separate the two is the `URL` class, which gives you
  `url.pathname` and `url.searchParams.get('name')`:

  ```js
  const url = new URL(req.url, `http://${req.headers.host}`);
  ```

- Set the status and headers with
  `res.writeHead(200, { 'Content-Type': 'application/json' })`.
- A response body must be a **string**: `res.end(JSON.stringify(yourObject))`.

You may find the following documentation useful:

- [`http.createServer`](https://nodejs.org/docs/latest-v26.x/api/http.html#httpcreateserveroptions-requestlistener)
- [`response.writeHead`](https://nodejs.org/docs/latest-v26.x/api/http.html#responsewriteheadstatuscode-statusmessage-headers)
- [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) and
  [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
