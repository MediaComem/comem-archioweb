# JavaScript Promises

Learn to use promises for asynchronous computation.

**Recommended reading**

* [JavaScript](../js/)
* [JavaScript Closures](../js-closures/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is a promise?](#what-is-a-promise)
  - [Asynchronous callback styles](#asynchronous-callback-styles)
  - [Promises/A+ specification](#promisesa-specification)
  - [English, please?](#english-please)
  - [Code, please?](#code-please)
  - [Consuming a promise](#consuming-a-promise)
    - [Let's try it](#lets-try-it)
- [Basic promise behavior](#basic-promise-behavior)
  - [Promise callback syntax](#promise-callback-syntax)
    - [More promise callback syntax](#more-promise-callback-syntax)
  - [Promise callbacks are **optional**](#promise-callbacks-are-optional)
    - [Unhandled promise rejections](#unhandled-promise-rejections)
  - [Using `catch()`](#using-catch)
  - [Asynchronicity](#asynchronicity)
  - [Promises can only be resolved or rejected **once**](#promises-can-only-be-resolved-or-rejected-once)
  - [The result of a promise can be retrieved **later**](#the-result-of-a-promise-can-be-retrieved-later)
  - [Promises are resolved with **one** value](#promises-are-resolved-with-one-value)
  - [Promise utilities](#promise-utilities)
- [Chaining promises](#chaining-promises)
  - [Chaining `.then()` calls](#chaining-then-calls)
  - [Promise resolution procedure](#promise-resolution-procedure)
    - [Returning a value from the resolution or rejection callback (1 & 4)](#returning-a-value-from-the-resolution-or-rejection-callback-1--4)
    - [Throwing an error from the resolution or rejection callback (2 & 5)](#throwing-an-error-from-the-resolution-or-rejection-callback-2--5)
    - [Returning a promise in the resolution callback (3 & 6)](#returning-a-promise-in-the-resolution-callback-3--6)
    - [Returning a rejected promise in the resolution callback (3 & 6)](#returning-a-rejected-promise-in-the-resolution-callback-3--6)
  - [An example](#an-example)
  - [Resolving promises in chains](#resolving-promises-in-chains)
  - [Rejecting promises in chains](#rejecting-promises-in-chains)
  - [Behavior of a promise chain](#behavior-of-a-promise-chain)
    - [All's right with the world](#alls-right-with-the-world)
    - [Catching errors in a promise chain](#catching-errors-in-a-promise-chain)
    - [Early errors in a promise chain](#early-errors-in-a-promise-chain)
  - [Handling errors in a promise chain](#handling-errors-in-a-promise-chain)
    - [Handling error example](#handling-error-example)
    - [Handling error result](#handling-error-result)
  - [An asynchronous example](#an-asynchronous-example)
    - [An asynchronous example with error handling](#an-asynchronous-example-with-error-handling)
- [Why use promises?](#why-use-promises)
  - [Triumph over the callback hell](#triumph-over-the-callback-hell)
    - [Callback hell example](#callback-hell-example)
    - [Flatten the pyramid of doom](#flatten-the-pyramid-of-doom)
    - [Flatten the pyramid of doom with promises](#flatten-the-pyramid-of-doom-with-promises)
  - [Complex chains](#complex-chains)
- [Parallel execution](#parallel-execution)
  - [Successful parallel execution](#successful-parallel-execution)
  - [Failed parallel execution](#failed-parallel-execution)
- [`async`/`await`](#asyncawait)
  - [The problem with promises](#the-problem-with-promises)
  - [Async functions and the `await` operator](#async-functions-and-the-await-operator)
  - [`await` and rejected promises](#await-and-rejected-promises)
    - [Handling rejected promises with `await`](#handling-rejected-promises-with-await)
  - [Awaiting the result of parallel executions](#awaiting-the-result-of-parallel-executions)
  - [Async functions always return promises](#async-functions-always-return-promises)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## What is a promise?

<!-- slide-front-matter class: center, middle -->

<img src='images/promises-logo.png' />

> A promise represents the **eventual result of an asynchronous operation**.
> It is a placeholder into which the **successful result value or reason for failure** will materialize.



### Asynchronous callback styles

There are many asynchronous callback styles.
Some libraries use **custom callbacks**:

```js
function onDone(data) {
  console.log('Data: ' + data);
}
function onFail(xhr) {
  console.warn('Request failed');
}

$.get('http://example.com').done(onDone).fail(onFail);
```

Node.js imposes a well-defined **convention**:

```js
fs.readFile('hello.txt', 'utf-8', function(err, result) {
  if (err) {
    return console.warn(err);
  }

  console.log(result);
});
```



### Promises/A+ specification

Promises are another way to organize asynchronous code.

All promises follow the [Promises/A+ specification][promises-spec].
Promises have been integrated into the JavaScript language since ECMAScript 2015.

Basically, a promise is an object with a `then()` function that has the following signature:

```js
promise.then(onResolved, onRejected)
```

It takes **2 callback functions**:

* The **first** one is called when the asynchronous operation is **successful**;
  in this case, we say the promise is **resolved**.
* The **second** one is called when the asynchronous operation **failed**;
  in this case, we say the promise is **rejected**.

**Only one** of them is called, never both.



### English, please?

<!-- slide-column -->

Imagine you are a **kid**.
Your mom **promises** you that she'll get you a **new phone next week**.

You don't **know** whether you will get that phone **until next week**.
Your mom can either **really buy** you a brand new phone, or **stand you up** and withhold the phone if she is not happy.

<!-- slide-column 30 -->

<img src='images/phone-gift.png' class='w70' />

<!-- slide-container -->

That's a promise.
A promise has 3 states; it can be:

* **Pending:** you don't know if you will get that phone until next week.
* **Resolved:** your mom really does buy you a brand new phone.
* **Rejected:** you don't get a new phone because your mom is not happy.



### Code, please?

Here's the same scenario in **ES6** JavaScript:

```js
// Make a promise
// We are given two functions to resolve or reject the promise with
let phonePromise = `new Promise(function(resolve, reject) {`

  let oneWeek = 1000 * 60 * 60 * 24 * 7; // One week in milliseconds.

  // In one week...
  setTimeout(function() {

    // Mom might be happy (or not)
    let isMomHappy = Math.random() < 0.5;

    if (`isMomHappy`) {
      let phone = {
        brand: 'Samsung',
        color: 'black'
      };
*     resolve(phone); // Resolve the promise (if mom is happy)
    } else {
      let reason = new Error('mom is very disappointed');
*     reject(reason); // Reject the promise (if mom is not happy)
    }
  }, oneWeek);
`})`;
```



### Consuming a promise

As we've seen from the specification,
you simply call a promise's `then()` method to be notified when it is resolved or rejected:

```js
function onResolved(phone) {
  console.log("I got a new phone! It's a " + phone.brand);
}

function onRejected(reason) {
  console.log("I didn't get a phone because " + reason);
}

phonePromise`.then(onResolved, onRejected)`;
```

* If a promise is **resolved**, the **first callback** will be called with the **resolved value** (the one passed to `resolve()` in the promise function)
* If a promise is **rejected**, the **second callback** will be called with the **rejection reason** (the one passed to `reject()` in the promise function)

#### Let's try it

<runkit></runkit>

```js
let phonePromise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    let isMomHappy = Math.random() < 0.5;
    if (isMomHappy) {
      resolve({ brand: 'Samsung', color: 'black' });
    } else {
      reject(new Error('mom is very disappointed'));
    }
  }, 5000);
});

let i = 0;
let interval = setInterval(function() {
  console.log(\`I still don't know if I'll get it (${i++})...`);
}, 1000);

function onResolved(phone) {
  console.log(\`I got a new phone! It's a ${phone.brand}`);
  clearInterval(interval);
}

function onRejected(reason) {
  console.log(\`I didn't get a phone because ${reason.message}`);
  clearInterval(interval);
}

phonePromise.then(onResolved, onRejected);
```



## Basic promise behavior

<!-- slide-front-matter class: center, middle -->



### Promise callback syntax

<runkit></runkit>

As we've seen in the previous examples,
you can declare your resolution and rejection callbacks separately and pass them to `.then()`:

```js
let promise = new Promise(function(resolve, reject) {
  resolve('ok');
});

function `onResolved`(value) {
  console.log(value);
}

function `onRejected`(err) {
  console.warn(\`Oops: ${err.message}`);
}

promise.then(`onResolved`, `onRejected`); // "ok"
```

#### More promise callback syntax

<runkit></runkit>

But you can also declare the callbacks directly in the `.then()` call:

```js
let promise = new Promise(function(resolve, reject) {
  resolve('ok');
});

promise.then(`function onResolved`(value) {
  console.log(value);
}, `function onRejected`(err) {
  console.warn(\`Oops: ${err.message}`);
}); // "ok"
```

For maximum laziness, you can also use arrow functions:

```js
let promise = new Promise(function(resolve, reject) {
  reject(new Error('bug'));
});

// "Oops: bug"
*promise.then(console.log, err => console.warn(\`Oops: ${err.message}`));
```

Further examples will use these shorter versions for brevity.



### Promise callbacks are **optional**

<runkit></runkit>

You don't have to pass both resolution and rejection callbacks:

```js
let promise = new Promise(function(resolve, reject) {
  resolve('ok');
});

// Only check if resolved.
promise.then(console.log); // "ok"

// Only check if rejected.
promise.then(undefined, console.warn); // Not called.
```

#### Unhandled promise rejections

<runkit></runkit>

However, if you don't specify a **rejection callback** and the promise is rejected,
it will produce an **unhandled promise rejection warning**.
Depending on the JavaScript runtime, it may even kill the process:

```js
let promise = new Promise(function(resolve, reject) {
  reject(new Error('bug'));
});

// Only check if resolved.
promise.then(console.log); // Not called, but UnhandledPromiseRejectionWarning.
```

It's good practice to always check for rejections.
However, you may safely **omit the resolution callback** if you don't need it:

```js
let promise = new Promise(function(resolve, reject) {
  reject(new Error('bug'));
});

// Only check if rejected.
promise.then(undefined, err => console.warn(\`Oops: ${err.message}`));
// "Oops: bug"
```



### Using `catch()`

The `catch()` function is simply a shortcut to plug a **rejection callback** into a promise chain:

```js
phonePromise.then(onResolved)`.catch(onRejected)`;
```

It's **equivalent** to:

```js
phonePromise`.then`(onResolved, `onRejected`);
```

Or to:

```js
phonePromise.then(onResolved)`.then`(undefined, `onRejected`);
```

But it's easier to read and is similar in behavior to `try/catch`.



### Asynchronicity

<runkit></runkit>

A promise is **always asynchronous**:

```js
*console.log('Before promising a phone');

let phonePromise = new Promise(function(resolve, reject) {
  // Immediately resolve the promise
  resolve({ brand: 'Samsung' });
});

phonePromise.then(function onResolved(phone) {
* console.log(\`I got a ${phone.brand}`);
});

*console.log('After promising a phone');
```

The output of this code will **always** be:

```txt
Before promising a phone
After promising a phone
I got a Samsung
```



### Promises can only be resolved or rejected **once**

<runkit></runkit>

Once you call `resolve`, the promise is **resolved**,
and additional calls to `resolve` or `reject` have no effect:

```js
let promise = new Promise(function(resolve, reject) {
* resolve('ok');
  reject(new Error('bug')); // No effect.
  resolve('foo'); // No effect.
});

// "ok"
promise.then(console.log, err => console.warn(\`Oops: ${err.message}`));
```

Similarly, once you call `reject`, the promise is **rejected**,
and additional calls to `resolve` or `reject` have no effect:

```js
let promise = new Promise(function(resolve, reject) {
* reject(new Error('bug'));
  reject(new Error('wheeee')); // No effect.
  resolve("I'm ok after all..."); // No effect.
});

// "Oops: bug"
promise.then(console.log, err => console.warn(\`Oops: ${err.message}`));
```



### The result of a promise can be retrieved **later**

<runkit></runkit>

Once a promise is resolved or rejected, its resolution value or rejection reason is **cached**.
Further calls to `.then()` will always produce the same result, even if called **later**:

```js
let promise = new Promise(function(resolve, reject) {
  resolve('ok');
});

// Check the promise now.
*promise.then(value => console.log(\`Now: ${value}`), console.warn);
// "Now: ok"

// Check again 2 seconds later.
setTimeout(function() {
* promise.then(value => console.log(\`After 2s: ${value}`), console.warn);
  // "After 2s: ok"
}, 2000);

// Check again 4 seconds later.
setTimeout(function() {
* promise.then(value => console.log(\`After 4s: ${value}`), console.warn);
  // "After 4s: ok"
}, 4000);
```



### Promises are resolved with **one** value

<runkit></runkit>

**Only one value** can be passed when using `resolve()` in a promise.
Additional values will be ignored:

```js
let fruitsPromise = new Promise(function(resolve, reject) {
  resolve(`'apple'`, 'banana', 'orange'); // Additional values are ignored.
});

fruitsPromise.then(console.log); // "apple"
```

If you need to send multiple values to the next callback,
use an **array or object**:

```js
let fruitsPromise = new Promise(function(resolve, reject) {
  resolve(`[ 'apple', 'banana', 'orange' ]`);
});

fruitsPromise.then(console.log); // [ "apple", "banana", "orange" ]
```



### Promise utilities

<runkit></runkit>

Quickly create a resolved promise with `Promise.resolve`:

```js
const resolvedPromise = `Promise.resolve`('foo');

resolvedPromise.then(function onResolved(value) {
* console.log(value); // "foo"
}, function onRejected(err) {
  console.warn(\`Oops: ${err.message}`); // not called
});
```

Quickly create a rejected promise with `Promise.reject`:

```js
const rejectedPromise = `Promise.reject`(new Error('bug'));

rejectedPromise.then(function onResolved(value) {
  console.log(value); // not called
}, function onRejected(err) {
* console.warn(\`Oops: ${err.message}`); // "Oops: bug"
});
```



## Chaining promises

<!-- slide-front-matter class: center, middle -->



### Chaining `.then()` calls

<runkit except='0'></runkit>

Promises are chainable; the `then()` function also **returns a promise**:

```js
let promise2 = phonePromise.then(onResolved, onRejected);
```

Will `promise2` be resolved or rejected?
That depends on `phonePromise`, `onResolved` and `onRejected`.
The simplest case is this one:

<!-- slide-column -->

```js
let promise1 = Promise.resolve('ok');
*let promise2 = promise1.then();

promise2.then(function(value) {
* console.log(value); // "ok"
}, function(err) {
  console.log(\`Oops: ${err.message}`);
});
```

<!-- slide-column -->

```js
const reason = new Error('bug');
let promise1 = Promise.reject(reason);
*let promise2 = promise1.then();

promise2.then(function(value) {
  console.log(value);
}, function(err) {
  // "Oops: bug"
* console.log(\`Oops: ${err.message}`);
});
```

<!-- slide-container -->

If neither `onResolved` nor `onRejected` is given, `promise2` will have **the same state** as `promise1`
(i.e. it will be resolved when `promise1` is resolved, or rejected when `promise1` is rejected).



### Promise resolution procedure

What if `phonePromise` is **resolved** and `onResolved` is called?

```js
let promise2 = phonePromise.then(`onResolved`, onRejected);
```

* **1:** If `onResolved` returns **a value**, `promise2` will be resolved with that value
* **2:** If `onResolved` throws an error, `promise2` will be rejected with that error as the reason
* **3:** If `onResolved` returns **another promise**, `promise2` will have the same state as that new promise

Similarly if `phonePromise` is **rejected** and `onRejected` is called:

```js
let promise2 = phonePromise.then(onResolved, `onRejected`);
```

* **4:** If `onRejected` returns **a value**, `promise2` will be resolved with that value
* **5:** If `onRejected` throws an error, `promise2` will be rejected with that error as the reason
* **6:** If `onRejected` returns **another promise**, `promise2` will have the same state as that new promise

#### Returning a value from the resolution or rejection callback (1 & 4)

<runkit></runkit>

If `phonePromise` is resolved and we **return a value in the resolution callback**,
the new `promise2` promise will be **resolved with that new value**:

```js
let phonePromise = `Promise.resolve('Samsung')`;
let promise2 = phonePromise.then(function onResolved(value) {
* return \`I got a ${value}`;
}, console.warn);

promise2.then(console.log, err => console.warn(\`Oops: ${err.message}`));
// "I got a Samsung"
```

**Returning a value in the rejection callback** behaves similarly;
the new `promise2` promise will also be **resolved with that new value**:

```js
let phonePromise = `Promise.reject(new Error('bug'))`;
let promise2 = phonePromise.then(console.log, function onRejected(err) {
* return \`${err.message}, but I'm ok now`;
});

promise2.then(console.log, err => console.warn(\`Oops: ${err.message}`));
// "bug, but I'm ok now"
```

Note that in the second case, we **handled the error**:
the original promise, `phonePromise`, is **rejected**;
but `promise2` is now **resolved**.

#### Throwing an error from the resolution or rejection callback (2 & 5)

<runkit></runkit>

If `phonePromise` is resolved and we **throw an error in the resolution callback**,
the new `promise2` promise will be **rejected with that error**:

```js
let phonePromise = `Promise.resolve('Samsung')`;
let promise2 = phonePromise.then(function onResolved(value) {
* throw new Error('bug');
}, console.warn);

promise2.then(console.log, err => console.warn(\`Oops: ${err.message}`));
// "Oops: bug"
```

We just transformed a **resolved promise**, `phonePromise`,
into a **rejected promise**, `promise2`.

**Throwing an error in the rejection callback** behaves similarly;
the new `promise2` promise will also be **rejected with that error**:

```js
let phonePromise = `Promise.reject(new Error('bug'))`;
let promise2 = phonePromise.then(console.log, function onRejected(err) {
* throw new Error('another bug');
});

promise2.then(console.log, err => console.warn(\`Oops: ${err.message}`));
// "Oops: another bug"
```

#### Returning a promise in the resolution callback (3 & 6)

<runkit></runkit>

The most interesting behavior is what happens when we **return a promise from a callback**,
in this example the resolution callback:

```js
let phonePromise = `Promise.resolve('Samsung')`;

let promise2 = phonePromise.then(function onResolved(value) {
  `return new Promise`(function(resolve, reject) {
    setTimeout(function() {
      `resolve`(\`Hey, I got a ${value}`);
    }, 5000);
  });
}, console.warn);

// "Samsung" (immediately)
phonePromise.then(console.log, err => console.warn(\`Oops: ${err.message}`));

// "Hey, I got a Samsung" (5 seconds later)
promise2.then(console.log, err => console.warn(\`Oops: ${err.message}`));
```

`phonePromise` is resolved immediately, but we return **a new promise** from its **resolution callback**.
That new promise is resolved 5 seconds later.
`promise2` will **wait for that new promise to be resolved or rejected**, and **adopt its state**.
In this example, it will be resolved.

#### Returning a rejected promise in the resolution callback (3 & 6)

<runkit></runkit>

The most interesting behavior is what happens when we **return a promise from a callback**,
in this example the resolution callback:

```js
let phonePromise = `Promise.resolve('Samsung')`;

let promise2 = phonePromise.then(function onResolved(value) {
  `return new Promise`(function(resolve, reject) {
    setTimeout(function() {
      `reject`(new Error('bug'));
    }, 5000);
  });
}, console.warn);

// "Samsung" (immediately)
phonePromise.then(console.log, err => console.warn(\`Oops: ${err.message}`));

// "Oops: bug" (5 seconds later)
promise2.then(console.log, err => console.warn(\`Oops: ${err.message}`));
```

Again, `phonePromise` is resolved immediately, but we return **a new promise** from its **resolution callback**.
That new promise is resolved 5 seconds later.
`promise2` will **wait for that new promise to be resolved or rejected**, and **adopt its state**.
In this example, it will be rejected.



### An example

Starting from our initial **phone promise** example.
Let's say, you, the kid, **promise** your friend that you will **show them the new phone** when your mom buys you one.
That's another promise.
Let's write it!

```js
function showOff(phone) {
  return new Promise(function(`resolve`, reject) {
    let message = 'Hey friend, I have a new ' +
        phone.color + ' ' + phone.brand + ' phone';

    `resolve`(message);
  });
}
```

**Chaining** this promise together with the phone promise is as simple as:

```js
function onResolved(result) {
  console.log(result);
}

function onRejected(err) {
  console.warn(\`Oops: ${err.message}`);
}

phonePromise`.then(showOff)`.then(onResolved, onRejected);
```



### Resolving promises in chains

<!-- slide-column -->

That second promise we wrote looks a bit complicated.
All we're doing is immediately resolving it with a message:

<!-- slide-column 65 -->

```js
function showOff(phone) {
  return `new Promise`(function(`resolve`, reject) {
    let message = 'Hey friend...';
    `resolve`(message);
  });
}
```

<!-- slide-container -->

<!-- slide-column -->

You can use the `Promise.resolve` shortcut instead:

<!-- slide-column 65 -->

```js
function showOff(phone) {
  let message = 'Hey friend...';
  return `Promise.resolve`(message);
}
```

<!-- slide-container -->

<!-- slide-column -->

Or as we've seen in the promise resolution procedure,
you can simply **return a value**:

<!-- slide-column 65 -->

```js
function showOff(phone) {
  return `'Hey friend...'`;
}
```

<!-- slide-container -->

In this promise chain, the 3 `showOff()` functions above are **equivalent**:

```js
phonePromise.then(showOff).then(onResolved, onRejected);
```



### Rejecting promises in chains

<!-- slide-column -->

You could also **reject the promise**.
Maybe you broke your leg and can't show off:

<!-- slide-column 65 -->

```js
function showOff(phone) {
  return `new Promise`(function(resolve, `reject`) {
    let reason = new Error('I broke my leg');
    `reject`(reason);
  });
}
```

<!-- slide-container -->

<!-- slide-column -->

You can also use the `Promise.reject` shortcut:

<!-- slide-column 65 -->

```js
function showOff(phone) {
  let reason = new Error('I broke my leg');
  return `Promise.reject`(message);
}
```

<!-- slide-container -->

<!-- slide-column -->

A third way is to simply **throw an error**.
That will **automatically reject the promise**:

<!-- slide-column 65 -->

```js
function showOff(phone) {
  `throw new Error`('I broke my leg');
}
```

<!-- slide-container -->

In this promise chain, the 3 `showOff()` functions above are **equivalent**:

```js
phonePromise.then(showOff).then(onResolved, onRejected);
```



### Behavior of a promise chain

We've seen that `then()` returns a promise, which is resolved or rejected depending on the state of the original promise and the result of the callback.

* What happens if you get the phone and successfully show off to your friend?
* What happens if you get the phone but break your leg and can't show off?
* What happens if you don't get the phone?

```js
phonePromise.then(showOff).then(onResolved).catch(onRejected);
```

**What functions are called** in these 3 cases?

#### All's right with the world

Assuming **mom is happy**,
and you didn't break your leg and **successfully showed off** to your friend,
this is what will happen:

<p class='center'><img src='images/promise-chain-1.png' class='w80' /></p>

Both `showOff()` and `onResolved()` will be called,
because **each promise** in the chain **is resolved**,
so the **first callback** of the two `then()` calls are executed.

`onRejected()` is **not called**.

Remember, `catch()` is equivalent to this:

```js
phonePromise.then(`showOff`).then(`onResolved`, onRejected);
```

Since everything is resolved, only the **first callback** of each `then()` call is executed.

#### Catching errors in a promise chain

What happens if **mom is happy** and gives you the phone,
but you break your leg and **can't show off** to your friend?

<p class='center'><img src='images/promise-chain-2.png' class='w80' /></p>

In this case, `showOff()` is called because `phonePromise` was **resolved**,
but `onResolved()` is **not called**.

`showOff()` was rejected, so the promise returned by `then(showOff)` is rejected as well,
therefore `onResolved()` will not be called.

Instead, the **second callback**, or **the next `catch()`** will be called,
therefore `onRejected()` is called:

```js
phonePromise.then(`showOff`).then(onResolved, `onRejected`);
phonePromise.then(`showOff`).then(onResolved).catch(`onRejected`);
```

#### Early errors in a promise chain

What happens if **you don't get the phone**?

<p class='center'><img src='images/promise-chain-3.png' class='w80' /></p>

In this case, `phonePromise` is **rejected**, so `showOff()` will **not be called**,
and the promise returned by `then(showOff)` will **also be rejected**, so `onResolved()` will not be called.

This time, only `onRejected()` is called:

```js
phonePromise.then(showOff).then(onResolved, `onRejected`);
phonePromise.then(showOff).then(onResolved).catch(`onRejected`);
```



### Handling errors in a promise chain

Remember the promise resolution procedure when a promise is **rejected**:

```js
let promise2 = phonePromise.then(onResolved, `onRejected`);
```

* **If `onRejected` returns a value, `promise2` will be resolved with that value**
* **If `onRejected` returns another promise, `promise2` will have the same state as that new promise**
* If `onRejected` throws an error, `promise2` will be rejected with that error as the reason

The first two cases are what interests us.
Even if `phonePromise` is rejected, if `onRejected` returns a **value or promise**,
the new promise returned by `then()` **might still be resolved** instead of rejected.

#### Handling error example

Let's assume `phonePromise` will be **resolved** successfully,
what will be the output of that code?

```js
function showOff(phone) {
  // Throwing an error will reject the promise
  // returned by phonePromise.then(showOff)
  throw new Error('I broke my leg');
}

function miracle(reason) {
  console.warn(reason);
  return "But I'm fine now";
}

function onResolved(result) {
  console.log(result);
}

function onRejected(reason) {
  console.warn(reason);
}

phonePromise.then(showOff).catch(miracle).then(onResolved, onRejected);
```

Will `onResolved()` or `onRejected()` be called?
What will it be called with?

#### Handling error result

The output will be:

```txt
I broke my leg
But I'm fine now
```

The following functions will be called:

<p class='center'><img src='images/promise-chain-4.png' class='w80' /></p>

* `phonePromise` is **resolved**, so `showOff()` will be called
* By throwing an error, `showOff()` will **reject** the promise returned by `phonePromise.then(showOff)`,
  so `miracle()` will be called since it's in a `catch()`
* **By returning a value, `miracle()` handles the failure** and the promise returned by `phonePromise.then(showOff).catch(miracle)` will be **resolved**
* Finally, `onResolved()` is called, since the previous promise has been **resolved**



### An asynchronous example

<runkit></runkit>

```js
const request = require('request-promise-native'), peer = require('request');
const apiUrl = 'https://evening-meadow-25867.herokuapp.com/api';
const now = new Date().getTime();

function `createDirector`() {
  const director = { name: \`John ${now}`, gender: 'male' };
  return request({
    method: 'POST', url: \`${apiUrl}/people`,
    body: director, json: true
  });
}

function `createMovie`(createdDirector) {
  console.log(\`Director ${createdDirector.name} created!`);
  const movie = { title: \`Movie ${now}`, directorHref: createdDirector.id };
  return request({
    method: 'POST', url: \`${apiUrl}/movies`,
    body: movie, json: true, qs: { include: 'director' }
  });
}

console.log('Doing all the things... please wait...');

*Promise.resolve().then(createDirector).then(createMovie)
  .then(createdMovie => console.log(\`Movie ${createdMovie.title} created!`))
  .catch(err => console.warn(\`Oops: ${err.message}`));
```

#### An asynchronous example with error handling

<runkit></runkit>

```js
const request = require('request-promise-native'), peer = require('request');
const apiUrl = 'https://evening-meadow-25867.herokuapp.com/api';
const now = new Date().getTime();

function createDirector() {
  const director = { /* `no name!` */ gender: 'male' };
  return request({
    method: 'POST', url: \`${apiUrl}/people`,
    body: director, json: true
  });
}

function createMovie(createdDirector) {
  // `I am not being called!`
  console.log(\`Director ${createdDirector.name} created!`);
  const movie = { title: \`Movie ${now}`, directorHref: createdDirector.id };
  return request({
    method: 'POST', url: \`${apiUrl}/movies`,
    body: movie, json: true, qs: { include: 'director' }
  });
}

console.log('Doing all the things... please wait...');

Promise.resolve().then(createDirector).then(createMovie)
  .then(createdMovie => console.log(\`Movie ${createdMovie.title} created!`))
* .catch(err => console.warn(\`Oops: ${err.message}`));
```



## Why use promises?

<!-- slide-front-matter class: center, middle -->

<img src='images/what-is-this.jpg' />



### Triumph over the callback hell

<!-- slide-column -->

Promises are one solution to the infamous **callback hell** or **pyramid of doom**.

Asynchronous code tends to be **nested** very deeply and be quite difficult to read and maintain.

<!-- slide-column -->

<img src='images/callback-hell.png' class='w100' />

<!-- slide-container -->

Our previous example showed us that we can execute **successive asynchronous calls without nesting**:

```js
Promise.resolve().then(createDirector).then(createMovie)
```

#### Callback hell example

Imagine that you want to do **3 sequential asynchronous operations** with a web service when a new user registers on your website:

* Register a new user
* Log in that user
* Retrieve statistics about that user

With jQuery, you could write it like this:

```js
$.post('/api/users', userData, function(createdUser) {
  $.post('/api/auth', userData, function(authData) {
    let query = { userId: createdUser.id, token: authData.token };
    $.get('/api/stats', query, function(statsData) {
      // Do something with statsData...
    });
  })
})
```

You have to **nest the callbacks** because AJAX requests are asynchronous.

This is pretty deep already, and we're not even handling errors yet.

#### Flatten the pyramid of doom

You could mitigate the issue by separating the calls into isolated functions:

```js
function createUser(userData) {
  $.post('/api/users', userData, function(createdUser) {
    authenticateUser(createdUser);
  });
}

function authenticateUser(createdUser) {
  $.post('/api/auth', userData, function(authData) {
    retrieveUserStats(createdUser, authData);
  });
}

function retrieveUserStats(createdUser, authData) {
  let query = { userId: createdUser.id, token: authData.token };
  $.get('/api/stats', { userId: createdUser.id }, function(statsData) {
    // Do something with statsData...
  });
}

createUser({ name: 'foo', password: 'test' });
```

But now you **don't see a clear call sequence** anymore.
You have to read the whole thing to know that `createUser` calls `authenticateUser`, which itself calls `retrieveUserStats`.
And we're **still not handling errors**.

#### Flatten the pyramid of doom with promises

It just so happens that jQuery AJAX calls also **return promises**:

```js
function createUser(userData) {
  return $.post('/api/users', userData);
}

function authenticateUser(createdUser) {
  return $.post('/api/auth', userData).then(function(authData) {
    return { createdUser: createdUser, authData: authData };
  });
}

function retrieveUserStats(data) {
  let query = { userId: data.createdUser.id, token: data.authData.token };
  return $.get('/api/stats', { userId: createdUser.id });
}

*createUser()
* .then(authenticateUser)
* .then(retrieveUserStats)
* .then(function(statsData) {
*   // Do something with statsData
* }).catch(function(err) {
*   // Any error that occurred at any step in the chain ends up here
* });
```

Now we have **flat code and automatic error handling**.



### Complex chains

This behavior enables complex asynchronous workflows with smart error handling:

<!-- slide-column -->

```js
`asyncThing1`().then(function() {
  return `asyncThing2`();
}).then(function() {
  return `asyncThing3`();
}).`catch`(function(err) {
  return `asyncRecovery1`();
}).then(function() {
  return `asyncThing4`();
}, function(err) {
  return `asyncRecovery2`();
}).`catch`(function(err) {
  console.log("Don't worry about it");
}).then(function() {
  console.log("All done!");
})
```

<!-- slide-column -->

<img src='images/complex-promise-chain.png' class='w100' />

<!-- slide-container -->

Promises are a **powerful abstraction** that make it **easy to compose asynchronous workflows**.



## Parallel execution

We've seen how to handle **sequential** asynchronous operations,
but promises also allow you to handle **parallel asynchronous operations**.

The `Promise.all()` method takes an **array of promises** and returns a **new promise**.
This new promise will be resolved **when all the promises in the array have been resolved**.

```js
Promise.all([ promise1, promise2, promise3 ]).then(function(results) {
  console.log(results); // [ result1, result2, result3 ]
}).catch(function(err) {
  // At least one promise was rejected
});
```

It will be resolved with an **array of results** which contains the resolution values of the original promises **in the same order** as they are passed to `Promise.all()`.

If one or more of the original promises is **rejected**,
the new promise **is also rejected** with the same reason as the first promise to be rejected.



### Successful parallel execution

<runkit></runkit>

Here's an example of parallel promise execution where **both are resolved**:

```js
let phonePromise = new Promise(function(resolve, reject) {
  resolve({ brand: 'Samsung' });
});

let cakePromise = new Promise(function(resolve, reject) {
  resolve('Yummy');
});

let promises = [ phonePromise, cakePromise ];

Promise.all(promises).then(function(results) {
  console.log(results.length); // 2
  console.log(results[0]); // { brand: 'Samsung' }
  console.log(results[1]); // 'Yummy'
});
```

<p class='center'><img src='images/promise-all-1.png' class='w80'></p>



### Failed parallel execution

<runkit></runkit>

Here's an example of parallel promise execution where **one is rejected**:

```js
let phonePromise = new Promise(function(resolve, reject) {
  resolve({ brand: 'Samsung' });
});

let cakePromise = new Promise(function(resolve, reject) {
  reject(new Error('The cake is a lie'));
});

let promises = [ phonePromise, cakePromise ];

Promise.all(promises).then(function(results) {
  // not called
}).catch(function(err) {
  console.log(err.message); // 'The cake is a lie'
});
```

<p class='center'><img src='images/promise-all-2.png' class='w80'></p>



## `async`/`await`

<!-- slide-front-matter class: center, middle -->

> With [ECMAScript 2017 (or ES8)][es8], JavaScript brings a new powerful way of working with promises: **`async` functions** and the **`await`** operator.



### The problem with promises

<runkit></runkit>

Promises are powerful, but they're still an **asynchronous construct** that's hard to reason about:

<!-- slide-column 55 -->

```js
function multiplyAsync(value, by) {
  return new Promise((resolve, rej) => {
    setTimeout(function() {
      resolve(value * by);
    }, 1500);
  })
}

function computeAllTheThings() {
* Promise
*   .resolve()
*   .then(() => multiplyAsync(2, 3))
*   .then(r1 => multiplyAsync(r1, 4))
*   .then(console.log);
}

console.log('Computing in progress...');
computeAllTheThings(); // 24 (3s later)
```

<!-- slide-column -->

```js
function multiply(value, by) {
  return value * by;
}

function computeAllTheThings() {
* const r1 = multiply(2, 3);
* const r2 = multiply(r1, 4);
* console.log(r2);
}

computeAllTheThings(); // 24
```

<!-- slide-container -->

It's still **better than traditional callbacks** because it helps us **avoid nesting** and has **error-handling**,
but it's just easier to understand **synchronous execution**.



### Async functions and the `await` operator

<runkit></runkit>

By declaring a function with the `async` keyword,
we can use the `await` operator inside it to **pause the execution of the function and wait for the promise to be resolved**.

<!-- slide-column 55 -->

```js
function multiplyAsync(value, by) {
  return new Promise((resolve, rej) => {
    setTimeout(function() {
      resolve(value * by);
    }, 1500);
  })
}

`async` function computeAllTheThings() {
  const r1 = `await` multiplyAsync(2, 3);
  const r2 = `await` multiplyAsync(r1, 4);
  console.log(r2);
}

console.log('Computing in progress...');
computeAllTheThings(); // 24 (3s later)
```

<!-- slide-column -->

```js
function multiply(value, by) {
  return value * by;
}

function computeAllTheThings() {
  const r1 = multiply(2, 3);
  const r2 = multiply(r1, 4);
  console.log(r2);
}

computeAllTheThings(); // 24
```

<!-- slide-container -->

Our **asynchronous code** on the left now **looks synchronous** and is much easier to understand.
At the same time, it **retains its asynchronous and non-blocking properties**.



### `await` and rejected promises

<runkit></runkit>

When the promise being awaited is **rejected**,
the function behaves as if the rejection error had been **thrown** on the line where the `await` statement is:

<!-- slide-column 55 -->

```js
function multiplyAsync(value, by) {
  return new Promise((res, reject) => {
    setTimeout(function() {
*     reject(new Error('bug'));
    }, 1500);
  })
}

async function computeAllTheThings() {
* const r1 = await multiplyAsync(2, 3);
  const r2 = await multiplyAsync(r1, 4);
  console.log(r2);
}

console.log('Computing in progress...');

computeAllTheThings()
  .catch(err => console.warn(err));
*// Error: bug (1.5s later)
```

<!-- slide-column -->

```js
function multiply(value, by) {
* throw new Error('bug');
}

function computeAllTheThings() {
* const r1 = multiply(2, 3);
  const r2 = multiply(r1, 4);
  console.log(r2);
}

computeAllTheThings();
*// Error: bug
```

#### Handling rejected promises with `await`

<runkit></runkit>

Since a **rejected promise** behaves like a `throw` when using `await`,
you can simply catch that error using a **traditional try/catch**:

```js
function multiplyAsync(value, by) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('bug')), 1500);
  })
}

async function computeAllTheThings() {
  let r1;
  `try {`
    r1 = `await` multiplyAsync(2, 3);
  `} catch (err) {`
    console.warn(\`Oops, first multiplication failed: ${err.message}`);
    return 0;
  `}`

  const r2 = await multiplyAsync(r1, 4);
  console.log(r2);
}

console.log('Computing in progress...');

computeAllTheThings().then(console.log) // 0
  .catch(err => console.warn(err));
*// Oops, first multiplication failed: bug (1.5s later)
```



### Awaiting the result of parallel executions

<runkit></runkit>

`Promise.all` is used to wait for the results of multiple promises executing in parallel.
Since that also returns a promise, you can simply `await` that:

```js
function multiplyAsync(value, by) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(value * by);
    }, 2000);
  })
}

async function computeAllTheThingsInParallel() {
  const promise1 = multiplyAsync(2, 3);
  const promise2 = multiplyAsync(3, 4);
  const results = `await Promise.all`([ promise1, promise2 ]);
  console.log(results);
}

console.log('Computing in progress...');

computeAllTheThingsInParallel()
  .catch(err => console.warn(err));
// [ 6, 12 ] (after 2s)
```

In this example, the 2 computations are executed in parallel and both results are available after 2 seconds (instead of 4).



### Async functions always return promises

<runkit></runkit>

```js
async function multiplyAsync(value, by) {
  return value * by;
}

const result = multiplyAsync(2, 4);

console.log('before');
console.log(result);
result.then(value => console.log(value));
console.log('after');
```

The output will **always** be:

```
before
Promise {}
after
8
```



## Resources

**Documentation**

* [Promises/A+ specification][promises-spec]
* [Promises][mdn-promises]
* [`async`][async] & [`await`][await]

**Further reading**

* [JavaScript Promises for Dummies][javascript-promises-for-dummies]
* [JavaScript Promises: an Introduction][javascript-promises-an-introduction]
* [Promise nuggets][promise-nuggets]
* [Aren't promises just callbacks?][arent-promises-just-callbacks]

**Popular promise librairies**

* [Bluebird][bluebird]
* [q][q]



[arent-promises-just-callbacks]: http://stackoverflow.com/questions/22539815/arent-promises-just-callbacks
[async]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
[bluebird]: http://bluebirdjs.com/docs/getting-started.html
[es8]: http://2ality.com/2016/02/ecmascript-2017.html
[javascript-promises-an-introduction]: https://developers.google.com/web/fundamentals/getting-started/primers/promises
[javascript-promises-for-dummies]: https://scotch.io/tutorials/javascript-promises-for-dummies
[mdn-promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[promise-nuggets]: https://promise-nuggets.github.io/
[promises-spec]: https://promisesaplus.com
[q]: https://github.com/kriskowal/q
