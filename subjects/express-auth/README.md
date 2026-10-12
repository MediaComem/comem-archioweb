# Express Authentication

Learn how to set up authentication with [JSON Web Tokens][jwt] in an [Express][express] application.

**You will need**

- A running [Express][express] application with [Mongoose][mongoose] plugged in

**Recommended reading**

- [Express](../express/)
- [Mongoose](../mongoose/)
- [Express best practices](../express-best-practices/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Security concepts](#security-concepts)
- [Storing passwords securely](#storing-passwords-securely)
  - [What is a hash function?](#what-is-a-hash-function)
  - [Hashing is not encryption](#hashing-is-not-encryption)
  - [Cryptographic hash functions](#cryptographic-hash-functions)
  - [Storing hashed passwords](#storing-hashed-passwords)
    - [Salting](#salting)
  - [Fast hashes are bad for passwords](#fast-hashes-are-bad-for-passwords)
- [bcrypt](#bcrypt)
  - [Using bcrypt to hash a password](#using-bcrypt-to-hash-a-password)
    - [A bcrypt hash](#a-bcrypt-hash)
    - [Using bcrypt with Express and Mongoose](#using-bcrypt-with-express-and-mongoose)
    - [Hiding the password hash from API responses](#hiding-the-password-hash-from-api-responses)
  - [Using bcrypt to verify a password](#using-bcrypt-to-verify-a-password)
    - [Verifying a password with Express and Mongoose](#verifying-a-password-with-express-and-mongoose)
    - [Never trust the request body](#never-trust-the-request-body)
- [Authentication tokens](#authentication-tokens)
  - [What is an authentication token?](#what-is-an-authentication-token)
  - [JSON Web Token (JWT)](#json-web-token-jwt)
    - [What's in a JWT?](#whats-in-a-jwt)
    - [JWT claims](#jwt-claims)
  - [The signing secret](#the-signing-secret)
  - [The `jsonwebtoken` package](#the-jsonwebtoken-package)
    - [Verifying a JWT](#verifying-a-jwt)
    - [Anyone can read a JWT](#anyone-can-read-a-jwt)
    - [JWT best practices](#jwt-best-practices)
- [Authentication flow](#authentication-flow)
    - [Unauthorized client](#unauthorized-client)
    - [Login](#login)
    - [Authenticated request](#authenticated-request)
    - [Full flow](#full-flow)
- [Sample code](#sample-code)
  - [Sample login route](#sample-login-route)
  - [Sample Express JWT authentication middleware](#sample-express-jwt-authentication-middleware)
    - [Using the authentication middleware](#using-the-authentication-middleware)
- [Authorization](#authorization)
  - [Enforcing permissions](#enforcing-permissions)
    - [Checking the owner](#checking-the-owner)
  - [Using roles](#using-roles)
    - [Extracting roles from the JWT](#extracting-roles-from-the-jwt)
    - [Writing an authorization middleware](#writing-an-authorization-middleware)
    - [Enforcing roles](#enforcing-roles)
    - [Augmenting permissions](#augmenting-permissions)
    - [Making administrators](#making-administrators)
    - [An administrator creation script](#an-administrator-creation-script)
    - [Running the script against Atlas](#running-the-script-against-atlas)
- [Keeping the token in the client](#keeping-the-token-in-the-client)
  - [In local storage](#in-local-storage)
  - [In an HttpOnly cookie](#in-an-httponly-cookie)
    - [Accepting both](#accepting-both)
    - [Cookies need the same site](#cookies-need-the-same-site)
    - [Badly configured cookies: CSRF](#badly-configured-cookies-csrf)
- [Going further](#going-further)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Security concepts

| Process        | Description                                                                                                                                                                                                             |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identification | Occurs when a user claims to have a specific identity, for example by supplying a **username**.                                                                                                                         |
| Authentication | The process of **proving an identity** by supplying appropriate credentials, such as a **password**, an **authentication token**, or by using a **public key** with asymmetric cryptography.                            |
| Authorization  | The process of **verifying that you have access to something**, such as a specific resource. For example, a user may have the right to edit their own posts in a social application, but not the posts of another user. |

In this presentation, we'll set up **authentication** with [bcrypt][bcrypt]
and [JSON Web Tokens][jwt], then **authorization** with Express middleware.

## Storing passwords securely

It's a bad idea to store your users' passwords in plain text.
If your database is compromised, not only will your application be compromised,
but others may be as well if users have used the same passwords elsewhere.

A better way is to use a [cryptographic hash function][hash].

### What is a hash function?

<!-- slide-column -->

A [hash function][hash-function] maps **data of arbitrary size** to **data of a fixed size**.
The value returned by a hash function is called a hash value, a **digest**, or simply a hash.

<img class='w100' src='images/hash-function-example.png' />

<!-- slide-column -->

<img class='w100' src='images/hash-function.jpg' />

### Hashing is not encryption

<!-- slide-column -->

<p class='center'><strong>Encryption</strong>: reversible with the key</p>

<img class='w100' src='images/encryption-example.gif' />

<!-- slide-column -->

<p class='center'><strong>Hashing</strong>: one-way, there is no key</p>

<img class='w100' src='images/hashing-example.gif' />

### Cryptographic hash functions

<!-- slide-column -->

A [cryptographic hash function][hash] is a hash function that has the following
properties:

- The same message always results in the same hash (**deterministic**).
- **Computing** the hash value of any message **is quick**.

<!-- slide-column 60 -->

<img class='w100' src='images/hash.png' />

<!-- slide-container -->

- It is infeasible to generate a message from its hash value except by trying
  all possible messages (**one-way**).
- A small change to a message should change the hash value so extensively that
  the new hash value appears uncorrelated with the old hash value.
- It is infeasible to find two different messages with the same hash value
  (collisions).

### Storing hashed passwords

The properties of a hash function make it suitable for securely verifying
users' passwords without actually storing them:

- When the user **registers** the first time, their password is hashed. **Only
  the hash is stored** in the database. The plain password is not kept.
- When the user comes back later to **log in**, the password is passed through
  the same hash function. **If the hash is the same, the password is the correct
  one** (in all probability).

If the database of such a service is compromised, a hacker does not get the
actual passwords, only the hashes, which are not reversible due to the
properties of a cryptographic hash function.

> This is also why most secure services cannot tell you what your current
> password is, because they do not store it. They can only verify that it is the
> correct one when you log in.

#### Salting

Using only a hash function is vulnerable to [rainbow tables][rainbow-table]: a
hacker may precompute the hashes for the most common passwords in advance. With
such a table, the password could be deduced from the hash.

The addition of a [**salt**][salt] solves this problem. A salt is a random piece
of data. In the simplest implementation, it is concatenated with your password
before the hash function is applied.

```js
// Without salt, vulnerable to rainbow table attacks.
hashFunction(password);

// With salt, generating rainbow tables for all
// possible salts is virtually impossible.
const salt = generateRandomBytes();
hashFunction(password + salt);
```

If you generate a different salt for each user account and store it alongside
the hashed password, you can reproduce the same hash when the user logs in.

With a 128-bit salt, there are 2<sup>128</sup> possible salts: nobody can
precompute a table for each one. And two users with the same password no longer
get the same hash.

### Fast hashes are bad for passwords

Salting does not stop an attacker who has stolen your database from **guessing**:
hash `123456` with the salt, compare, try the next password. And a
cryptographic hash function is designed to be **quick**:

| Function         | Hashes per second (one laptop core) |
| :--------------- | ----------------------------------: |
| SHA-256          |                          ~1,800,000 |
| bcrypt (cost 10) |                                 ~15 |

A graphics card computes **billions** of SHA-256 hashes per second, and most
passwords are in a list of a few million common ones.

A **password hashing function** such as [bcrypt][bcrypt] is a hash function
that is **deliberately slow**, and salts for you.

## bcrypt

<!-- slide-front-matter class: center, middle -->

An adaptive password hashing function.

### Using bcrypt to hash a password

The [`bcrypt` package][bcrypt-npm] provides an implementation of the
[bcrypt][bcrypt] password-hashing function. Simply use its `hash` function to
generate a bcrypt hash from a password.

```js
import bcrypt from 'bcrypt';

const plainPassword = 'changeme';
const costFactor = 10;

const hashedPassword = await bcrypt.hash(plainPassword, costFactor);

// Store the hashed password in your database...
```

> Do not use the synchronous methods provided by the `bcrypt` package (e.g.
> `hashSync`): hashing is slow **on purpose**, and they would block your whole
> application until they are done.

???

Recent npm versions warn that bcrypt's install script was skipped. bcrypt ships
prebuilt binaries, so it works anyway. `npm install-scripts deny bcrypt` records
that choice and silences the warning.

#### A bcrypt hash

```js
const hash = await bcrypt.hash('changeme', 10);
// $2b$10$2EbT0bau/bDReFySVMFGw.YSeqlRNBlldEZyD0qEgrJXogsAQ77/6
```

| Part                              | Meaning                                |
| :-------------------------------- | :------------------------------------- |
| `$2b$`                            | The version of the algorithm           |
| `10$`                             | The cost factor: 2<sup>10</sup> rounds |
| `2EbT0bau/bDReFySVMFGw.`          | The random salt (22 characters)        |
| `YSeqlRNBlldEZyD0qEgrJXogsAQ77/6` | The hash itself (31 characters)        |

The **salt and cost are stored in the hash**: you need no separate column.
Hashing `changeme` again gives a **different** hash, because the salt is new.

bcrypt is **adaptive**: each +1 to the cost **doubles** the time (cost 10: ~70
ms, 12: ~280 ms, 14: ~1.1 s). Increase it as hardware gets faster.
[OWASP][owasp-password-storage] recommends at least 10.

#### Using bcrypt with Express and Mongoose

Here's how the `POST /users` route from the [Mongoose](../mongoose/) subject
changes:

```js
router.post('/', async function (req, res) {
  const { name, password } = req.body ?? {};
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(422).send({ message: 'Password is too short' });
  }

* const hashedPassword = await bcrypt.hash(password, 10);
* const user = await User.create({ name, password: hashedPassword });

  res
    .status(201)
    .set('Location', \`/users/${user.id}`)
    .send(user);
});
```

- Validate the password **before** hashing it: the schema only ever sees the
  hash, which is always 60 characters long.
- List the fields a client may set. With `User.create(req.body)`, anyone
  could register with `"role": "admin"` (more on roles later).

#### Hiding the password hash from API responses

You don't want your API users to view the password hash. Here's one way to hide
it with Mongoose:

```js
const userSchema = new Schema({
  name: { type: String, required: true, `unique: true` },
  password: { type: String, required: true }
});

*userSchema.set('toJSON', {
*  transform: transformJsonUser
*});

function transformJsonUser(doc, json, options) {
* // Remove the hashed password from the generated JSON.
* delete json.password;
  return json;
}
```

> The name must be **unique**, since users will log in with it.

### Using bcrypt to verify a password

The `compare` function takes the following arguments:

- The **plain password** to check.
- The **hashed password** from your database.

It returns a promise that resolves to **a boolean indicating whether the
password matches**.

```js
const valid = await bcrypt.compare(plainPassword, hashedPassword);

// Do something depending on password validity...
```

#### Verifying a password with Express and Mongoose

Here's a password verification example for a login route:

```js
router.post('/login', async function (req, res) {
  const { name, password } = req.body ?? {};
  if (typeof name !== 'string' || typeof password !== 'string') {
    return res.status(422).send({ message: 'Name and password are required' });
  }

  const user = await `User.findOne`({ name }).exec();
  if (!user) {
    return res.status(401).send({ message: 'Invalid name or password' });
  }

  const valid = await `bcrypt.compare(password, user.password)`;
  if (!valid) {
    return res.status(401).send({ message: 'Invalid name or password' });
  }

  // Login is valid.
  res.send({ message: \`Welcome ${user.name}!` });
});
```

Respond the same way whether the name or the password is wrong, so that an
attacker cannot find out which names exist.

#### Never trust the request body

`express.json()` gives you **any JSON value**, not just strings. Without the
`typeof` checks, this request logs in as **the first user whose password is
`123456`**, without knowing any name:

```http
POST /auth/login HTTP/1.1
Content-Type: application/json

{ "name": { "$ne": null }, "password": "123456" }
```

`{ name: { $ne: null } }` is a valid MongoDB filter ("any name that is not
null"). With `$regex`, an attacker can even choose which users to target. This
is a [NoSQL injection][nosql-injection].

- **Check the type** of anything you put in a query filter.
- Express 5 does not parse `?name[$ne]=x` into an object, so **query strings**
  are safe by default. **JSON bodies** are not.

## Authentication tokens

<!-- slide-front-matter class: center, middle -->

### What is an authentication token?

After logging in, the client receives **proof** that it sends with each
request, instead of the password:

- With **server-side sessions**, the proof is a random session ID (usually in a
  cookie), and the server **stores** who it belongs to.
- With an **authentication token**, the proof **contains** who the user is,
  **signed** by the server. The server stores nothing.

Tokens are:

- **Stateless**: any server that knows the key can verify them, without a
  session store.
- **Easy for any client**: a mobile app or Postman just sends a header.
- Able to carry **claims**, such as the user's roles.

But a token **cannot be revoked**: it stays valid until it **expires**, even
after the user "logs out" (the client just forgets it) or is banned.

### JSON Web Token (JWT)

A [JSON Web Token][jwt] is a special format for authentication tokens:

<p class='center'><img class='w100' src='images/jwt.png' /></p>

#### What's in a JWT?

A JWT has three base64url-encoded parts, separated by dots:

- A **header** indicating the **signing algorithm** and other JWT configuration
  properties.
- A **payload** containing the **claims**, e.g. who the authenticated user is.
- A **signature** of the first two parts. With the default `HS256` algorithm, it
  is an [HMAC][hmac] (with SHA-256) based on a **secret** known only by the
  server.

Without the secret, nobody can compute a valid signature:

- An attacker cannot create a valid token.
- Changing a single character of the payload (e.g. adding `"scope": "admin"`)
  invalidates the signature.

But the payload is **not encrypted**: anyone holding the token can read it.

#### JWT claims

Use the [**registered claims**][jwt-claims] when one fits. These are some of the
most common claims (all are optional):

| Claim | Description                                     |
| :---- | :---------------------------------------------- |
| `iss` | Issuer                                          |
| `sub` | Subject (e.g. the ID of the authenticated user) |
| `aud` | Audience                                        |
| `exp` | Expiration time (UNIX timestamp, in seconds)    |
| `nbf` | Not before (UNIX timestamp, in seconds)         |
| `iat` | Issued at (UNIX timestamp, in seconds)          |

For example, a very simple token might only contain `sub` to indicate the
authenticated user, and `exp` for an expiration date.

> New public claims should either be registered, or use a collision-resistant
> name such as a URL, e.g. `https://my-api.com/jwt/claims/custom`.

### The signing secret

Anyone who knows the secret can sign a token for **any user**. It must be **long
and random**, and **never** committed. Generate one with:

```bash
$> node -p "crypto.randomBytes(32).toString('base64')"
dM547mSvdWK80o73x1TyDxnCjBCgg4EJH+xNY2w9RAY=
```

Set it as `JWT_SECRET` in your `.env` file and on Render, and read it in
`config.js` (see [Express best practices](../express-best-practices/)):

```js
export const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('Environment variable $JWT_SECRET must be set');
}
```

> Do **not** fall back to a default such as `'changeme'`: if you forget the
> variable on Render, your API signs tokens with a secret everyone knows.

### The `jsonwebtoken` package

Generating a JWT is trivial with the [`jsonwebtoken`][jsonwebtoken] npm package:

```js
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';

// Create and sign a token that expires in 7 days.
*const token = jwt.sign({ sub: 'userId42' }, jwtSecret, { expiresIn: '7d' });

// Use the signed token...
```

The package adds the `iat` and `exp` claims for you.

> `jwt.sign` is **synchronous** when you do not give it a callback. Unlike with
> bcrypt, that is fine: signing a token takes about 0.05 ms, while hashing a
> password takes about 70 ms.

#### Verifying a JWT

Verifying it is just as easy:

```js
try {
* const payload = jwt.verify(token, jwtSecret);
  // { sub: 'userId42', iat: 1791796683, exp: 1792401483 }
} catch (err) {
  // err.name is "TokenExpiredError" or "JsonWebTokenError"
  // (invalid signature, malformed token...)
}
```

`jwt.verify` checks the signature **and** the expiration date.

> `jwt.decode` reads a token **without verifying it**. Never use it for
> authentication.

#### Anyone can read a JWT

```js
const token = jwt.sign({ sub: 'userId42' }, jwtSecret, { expiresIn: '7d' });
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VySWQ0MiIsImlh...

const [header, payload, signature] = token.split('.');

Buffer.from(header, 'base64url').toString();
// {"alg":"HS256","typ":"JWT"}

Buffer.from(payload, 'base64url').toString();
// {"sub":"userId42","iat":1791796683,"exp":1792401483}
```

No secret is needed: you can also paste a token into [jwt.io][jwt].

#### JWT best practices

- **Keep it secret. Keep it safe.**
  The signing key should be treated like any other credentials and revealed only to services that absolutely need it.
  It should not be put under version control.
- **Do not add sensitive data to the payload.** Tokens are signed to protect
  against manipulation, but anyone can decode them. Add the bare minimum number
  of claims to the payload for best performance and security.
- **Give tokens an expiration.** Once a token is signed, it is valid until it
  expires, or forever if it has no `exp` claim. Have a strategy for expiring
  and/or revoking tokens.
- **Embrace HTTPS.** Do not send tokens over non-HTTPS connections as those
  requests can be intercepted and tokens compromised.

## Authentication flow

<!-- slide-front-matter class: center, middle -->

How a typical API using JWTs for authentication could behave.

#### Unauthorized client

On the first try, the user does not provide any authentication:

<img class='w100' src='images/auth-seq-401.svg' />

#### Login

Since the server indicated that authentication is missing,
the user will send their credentials to obtain a new JWT:

<img class='w100' src='images/auth-seq-login.svg' />

#### Authenticated request

Now that the user has a valid JWT, they can send it as a bearer token in the
`Authorization` header to authenticate:

<img class='w100' src='images/auth-seq-valid.svg' />

#### Full flow

This is a summary of the general principle:

- The user sends their credentials to obtain a JWT.
- The JWT is sent as authentication for all requests to protected resources.

<img class='w100' src='images/auth-seq-full.svg' />

## Sample code

<!-- slide-front-matter class: center, middle -->

A little help.

### Sample login route

```js
// File: routes/auth.js (mounted at /auth in app.js)
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';
import User from '../models/user.js';

router.post('/login', async function (req, res) {
  const { name, password } = req.body ?? {};
  if (typeof name !== 'string' || typeof password !== 'string') {
    return res.status(422).send({ message: 'Name and password are required' });
  }

  const user = await User.findOne({ name }).exec();
  if (!user) {
    return res.status(401).send({ message: 'Invalid name or password' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).send({ message: 'Invalid name or password' });
  }

* const payload = { sub: user.id }; // user.id is the ID as a string
* const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
* res.send({ token });
});
```

### Sample Express JWT authentication middleware

```js
// File: middleware/auth.js
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';

export function authenticate(req, res, next) {
  // Ensure the header is present and contains a bearer token.
  const authorization = req.get('Authorization');
  const match = authorization?.match(/^Bearer (.+)$/i);
  if (!match) {
    return unauthorized(res, 'A bearer token is required');
  }

  // Extract and verify the JWT.
  try {
    const payload = jwt.verify(match[1], jwtSecret);
    // Pass the ID of the authenticated user to the next middleware.
    req.currentUserId = payload.sub;
    next();
  } catch {
    unauthorized(res, 'Your token is invalid or has expired');
  }
}

function unauthorized(res, message) {
  // A 401 response must tell the client how to authenticate.
  res.status(401).set('WWW-Authenticate', 'Bearer').send({ message });
}
```

#### Using the authentication middleware

The previous middleware can simply be plugged into routes which require
authentication:

```js
// File: routes/things.js
import { authenticate } from '../middleware/auth.js';

router.post('/', `authenticate`, async function (req, res) {
  // If we reach this function, the previous authentication middleware
  // has done its job, i.e. a valid JWT was in the Authorization header.
  const thing = await Thing.create({
    ...req.body,
*   user: req.currentUserId // The owner comes from the token.
  });

  res.status(201).set('Location', \`/things/${thing.id}`).send(thing);
});
```

`user` comes **last**, so it overrides any `user` property in the request body.

> If you need the whole user object, you can always find it from the ID with
> `User.findById`.

You may also use an existing library which verifies the token for you instead
of writing the code yourself, like [express-jwt][express-jwt].

## Authorization

<!-- slide-front-matter class: center, middle -->

<p class='center'><img class='w80' src='images/access-denied.jpg' /></p>

### Enforcing permissions

Even once you have made sure the user is **authenticated**, your job is not
necessarily done. You may still have to check whether the user is **authorized**
to perform the action.

For example, let's assume a user can only modify the things they created. When a
thing is modified, you have to check **whether the currently authenticated user
is the one who actually created that thing**.

#### Checking the owner

```js
router.patch(
  '/:id',
* authenticate,
  loadThingFromParams,
  async function (req, res) {
    // Check authorization: was this thing created by the authenticated
    // user (good), or by another user (bad)?
*   if (req.thing.user.toString() !== req.currentUserId) {
*     throw createError(403, 'This is not your thing');
*   }

    // Do what needs to be done...
  }
);
```

- `authenticate` comes **first**: an anonymous client gets a `401` without even
  querying the database.
- `req.thing.user` is an **ObjectId**: without `toString()`, it is never equal
  to the string from the token, and even the owner gets a `403`.
- `loadThingFromParams` is a middleware that loads the thing from the database
  and attaches it to `req.thing`, like `loadPersonFromParams` in [Express best
  practices](../express-best-practices/#13).

### Using roles

If your application requires more advanced permissions than just checking the
owner, you can define simple static **roles**, such as "administrator", and
store them in your users' documents:

```js
const userSchema = new Schema({
  // ...
* role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
```

An interesting property of JWTs is that you can store anything in them, such as
a user's permissions:

```js
const payload = {
  sub: user.id, // The subject (who is authenticated).
* scope: user.role // Include permissions in the payload.
};

const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
```

> The `scope` claim is an officially [registered claim][jwt-claims] which was
> defined in [RFC 8693 OAuth 2.0 Token Exchange][jwt-scope]. It is a list of
> permissions separated by spaces.

#### Extracting roles from the JWT

To use the roles or permissions you have defined, you must extract them from the
JWT when verifying it, and pass them further along the middleware chain just
like the subject. You could modify the `authenticate` middleware to do this:

```js
// Extract and verify the JWT.
try {
  const payload = jwt.verify(match[1], jwtSecret);

  // Pass the ID of the authenticated user to the next middleware.
  req.currentUserId = payload.sub;

* // Obtain the list of permissions from the "scope" claim.
* const scope = payload.scope;
* req.currentUserPermissions = scope ? scope.split(' ') : [];

  next();
} catch {
  unauthorized(res, 'Your token is invalid or has expired');
}
```

#### Writing an authorization middleware

You could write a simple factory function to create Express middlewares that
check whether a user has a role or permission:

```js
export function authorize(requiredPermission) {
  // Create and return an authorization middleware. The required permission
  // will be available in the returned function because it is a closure.
  return function authorizationMiddleware(req, res, next) {
    // Undefined if the authenticate middleware has not run.
    const permissions = req.currentUserPermissions ?? [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).send({ message: 'Insufficient permissions' });
    }

    // The user is authorized.
    next();
  };
}
```

#### Enforcing roles

You can then use this function to add authorization middleware to your routes.
For example, you could require a specific permission before allowing access to a
route:

```js
router.delete(
  '/:id',
  // Authenticate before authorization.
  authenticate,
  // Ensure only administrators can access this route.
  `authorize('admin')`,
  async function (req, res) {
    // Do admin stuff...
  }
);
```

#### Augmenting permissions

Or you could use a role to grant further permissions to a route accessible by
normal users. For example, a user may not be able to edit another user's things,
but maybe an administrator is allowed to:

```js
// All authenticated users can access this route.
router.patch(
  '/:id',
  authenticate,
  loadThingFromParams,
  async function (req, res) {
*   // The user is authorized to edit the thing only if they are
*   // its owner, or if they are an administrator.
*   const authorized =
*     req.currentUserPermissions.includes('admin') ||
*     req.thing.user.toString() === req.currentUserId;
*
*   if (!authorized) {
*     return res.status(403).send({ message: 'This is not your thing' });
*   }

    // Do what needs to be done...
  }
);
```

#### Making administrators

Nobody can register as an administrator, because the `POST /users` route only
sets the name and the password. Promote your first administrator in
[`mongosh`](../mongodb/):

```js
db.users.updateOne({ name: 'jdoe' }, { $set: { role: 'admin' } });
```

The user must then **log in again**: the role in a token is a **copy**, made
when the token was signed.

For the same reason, if you demote an administrator, their current token keeps
the `admin` scope until it expires.

> You can also create an administrator from scratch with a script, as shown in
> the next slides.

#### An administrator creation script

```js
// File: scripts/create-admin.js
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/user.js';

const { DATABASE_URL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;
if (!DATABASE_URL || !ADMIN_NAME || !ADMIN_PASSWORD) {
  throw new Error('Set $DATABASE_URL, $ADMIN_NAME and $ADMIN_PASSWORD');
}

await mongoose.connect(DATABASE_URL);

if (await User.exists({ name: ADMIN_NAME })) {
  console.log(\`User ${ADMIN_NAME} already exists`);
} else {
* const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
* await User.create({ name: ADMIN_NAME, password, role: 'admin' });
  console.log(\`Administrator ${ADMIN_NAME} created`);
}

await mongoose.disconnect();
```

Running it twice does no harm: it only creates the administrator if the name
is not taken.

#### Running the script against Atlas

Render's free plan has no shell, but you don't need one: your database is on
**Atlas**, which you can reach from your machine. Put the variables in a file
named `.env.atlas`:

```bash
DATABASE_URL="mongodb+srv://admin:secret@your-cluster.abcd.mongodb.net/my-api"
ADMIN_NAME="jdoe"
ADMIN_PASSWORD="…"
```

Add `/.env.*` to your `.gitignore` file, then run:

```bash
$> node --env-file=.env.atlas scripts/create-admin.js
Administrator jdoe created
```

- Do **not** write the variables on the command line: your shell history would
  keep the database password (in the URL) and the administrator's password.
- **Quote** the values: in an unquoted value, `#` starts a comment.

## Keeping the token in the client

<!-- slide-front-matter class: center, middle -->

Where should your PWA keep its token?

### In local storage

The PWA stores the token it gets when logging in, and sends it in the
`Authorization` header itself:

```js
const response = await fetch(\`${apiUrl}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, password })
});
const { token } = await response.json();
*localStorage.setItem('token', token);

// Later, with each request:
const things = await fetch(\`${apiUrl}/things`, {
* headers: { Authorization: \`Bearer ${localStorage.getItem('token')}` }
});
```

- It is **simple**, and it works with the API exactly as shown so far, even if
  the PWA and the API are on different sites (with CORS enabled on the API).
- But **any script on the page can read it**. With a single [XSS][xss]
  vulnerability (e.g. user content inserted with `innerHTML`), an attacker can
  steal the token and use it until it expires.

### In an HttpOnly cookie

The login route can also put the token in a cookie that JavaScript **cannot
read**:

```js
const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '7d' });

*res.cookie('token', token, {
* httpOnly: true, // Invisible to JavaScript.
* secure: true, // Only sent over HTTPS.
* sameSite: 'strict', // Never sent with requests from other sites.
* maxAge: 7 * 24 * 3600 * 1000 // In milliseconds.
*});

res.send({ token });
```

The browser stores the cookie and sends it back with every request to the API:
the PWA has nothing to do. An XSS attack can still send requests as the user
while the page is open, but it cannot **steal** the token.

> Logging out requires a route that deletes the cookie:
> `res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' })`.

#### Accepting both

The login response still contains the token, so the API can accept both: the
**cookie** from the PWA, and the **header** from Postman or your tests. Plug
[cookie-parser][cookie-parser] in `app.js` to fill `req.cookies`:

```js
*app.use(cookieParser());
```

Then look for the token in both places:

```js
export function authenticate(req, res, next) {
  // A bearer token in the Authorization header (Postman, tests)...
  const match = req.get('Authorization')?.match(/^Bearer (.+)$/i);
  // ...or the cookie set by the login route (the PWA).
* const token = match?.[1] ?? req.cookies.token;
  if (!token) {
    return unauthorized(res, 'Authentication is required');
  }

  // Verify the JWT as before...
}
```

#### Cookies need the same site

A `sameSite: 'strict'` cookie is only sent if the PWA is on the **same site**
as the API. Two Render services are **not**: `onrender.com` is a [public
suffix][psl], like `github.io` or `netlify.app`, so `my-pwa.onrender.com` and
`my-api.onrender.com` are as foreign to each other as two unrelated domains.

The simplest solution: let your **API's Render service also serve the PWA**.
Copy the PWA's built files into a `public` directory and add to `app.js`:

```js
app.use(express.static('public'));
```

The PWA and the API then have the **same origin**: the cookie just works, and
you need no CORS at all. During development, a dev server proxy (e.g. [Vite's
`server.proxy`][vite-proxy]) does the same.

> Otherwise, the cookie is a third-party cookie. It needs `sameSite: 'none'`
> (see the next slide), and Safari, which every iOS browser is built on,
> [blocks it anyway][webkit-cookies].

#### Badly configured cookies: CSRF

With `sameSite: 'none'`, the browser attaches the cookie to requests **from any
site**. A malicious page your user visits can then make their browser act on
your API in their name, without them noticing. This is called [cross-site
request forgery][csrf] (CSRF):

```html
<!-- On evil.example -->
<form method="POST" action="https://my-api.onrender.com/things/42/like"></form>
<script>
  document.forms[0].submit();
</script>
```

If the API also allows **any origin** with credentials, e.g.
`cors({ origin: true, credentials: true })`, the malicious page can even
**read** the responses, such as your user's data.

- Keep `sameSite: 'strict'` (or `'lax'`): both stop these attacks.
- If you need CORS with credentials, allow **only** your PWA's exact origin.
- Bearer tokens are not affected: browsers never add a header by themselves.

## Going further

- **Rate-limit the login route**, so that nobody can try thousands of passwords
  (e.g. with [express-rate-limit][express-rate-limit]).
- **Refresh tokens**: short-lived tokens (minutes), plus a long-lived token
  stored in the database to obtain new ones. Deleting it revokes the access.
- **Delegate authentication** to Google, Apple or GitHub ("Sign in with...")
  with [OAuth 2.0 and OpenID Connect][oidc].
- **Argon2id** is [OWASP][owasp-password-storage]'s first choice for new
  systems. bcrypt with a cost of at least 10 remains acceptable. bcrypt only
  uses the first **72 bytes** of a password.
- Your **real-time** component will need authentication too: send the JWT when
  opening the connection.

## References

- [OWASP Password Storage Cheat Sheet][owasp-password-storage]
- [OWASP Authorization Cheat
  Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Mass Assignment Cheat
  Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [JWT introduction](https://www.jwt.io/introduction)
- [RFC 8725: JSON Web Token Best Current
  Practices](https://www.rfc-editor.org/rfc/rfc8725)
- [Token-based authentication made
  easy](https://auth0.com/learn/token-based-authentication-made-easy)

[bcrypt]: https://en.wikipedia.org/wiki/Bcrypt
[bcrypt-npm]: https://www.npmjs.com/package/bcrypt
[cookie-parser]: https://github.com/expressjs/cookie-parser
[csrf]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
[express]: https://expressjs.com
[express-jwt]: https://github.com/auth0/express-jwt
[express-rate-limit]: https://www.npmjs.com/package/express-rate-limit
[hash]: https://en.wikipedia.org/wiki/Cryptographic_hash_function
[hash-function]: https://en.wikipedia.org/wiki/Hash_function
[hmac]: https://en.wikipedia.org/wiki/HMAC
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[jwt]: https://www.jwt.io
[jwt-claims]: https://www.iana.org/assignments/jwt/jwt.xhtml
[jwt-scope]: https://www.rfc-editor.org/rfc/rfc8693.html#section-4.2
[mongoose]: https://mongoosejs.com
[nosql-injection]: https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html
[oidc]: https://openid.net/developers/how-connect-works/
[owasp-password-storage]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
[psl]: https://publicsuffix.org/
[rainbow-table]: https://en.wikipedia.org/wiki/Rainbow_table
[salt]: https://en.wikipedia.org/wiki/Salt_(cryptography)
[vite-proxy]: https://vite.dev/config/server-options#server-proxy
[webkit-cookies]: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
[xss]: https://owasp.org/www-community/attacks/xss/
