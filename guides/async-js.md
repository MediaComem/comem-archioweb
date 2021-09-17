# The many worlds of asynchronous JavaScript

There are so many ways to write asynchronous JavaScript code that it can get
confusing. Especially in the Node.js world:

* First, there was the `function(err, result)` callback convention.
* Then [promises][promise] got popular in the JavaScript world.
* Then [async functions][async-await] were added to JavaScript with [ECMAScript
  2017][es2017] to simplify promise-based code.

Sometimes, an asynchronous method from a particular library supports both
Node.js-style callbacks and promises, meaning you can use it 3 different ways.

This guide takes the example of the `save()` method of [Mongoose][mongoose]
documents which persists a given document to a MongoDB database, and shows the 3
ways you can write that call using the above techniques. The 3 code examples are
equivalent in functionality.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The method](#the-method)
- [Node.js callbacks](#nodejs-callbacks)
- [Promises](#promises)
- [Promises with async/await](#promises-with-asyncawait)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## The method

[The documentation of the `save()` method][mongoose-save] states that the
function's parameters and return values are as follow:

**Parameters**

* `[options] Object` - optional options.
* `[fn] Function` - optional callback.

**Returns**

* `Promise|undefined` - Returns undefined if used with callback or a Promise
  otherwise.

This shows you that the method supports both styles: Node.js-style callbacks or
promises. If you pass a callback function, the method will return `undefined`
and you will get the result in the callback. If you do not pass a callback
function, the method will return a Promise which you can use to get at the
result with the `.then()` method.



## Node.js callbacks

Here's how you would use the `save()` method with a Node.js-style callback:

```js
function nodeCallbackExample() {
  doc.save(function(err, savedDoc) {
    if (err) {
      return console.warn(savedDoc);
    }

    console.log(savedDoc);
  });
}
```

This looks "more like Node.js" code, especially the core Node.js modules, most
of which do not return Promises.



## Promises

Here's how you would use the `save()` method to obtain a Promise, and how to get
the result or catch the error:

```js
function promiseExample() {
  doc.save().then(function(savedDoc), {
    console.log(savedDoc);
  }).catch(function(err) {
    console.warn(err);
  });
}
```

This looks less like "classic" Node.js code but may look more like modern
JavaScript code, considering more and more libraries use Promises (like
Mongoose, for example).



## Promises with async/await

Here's how you would use the `save()` method with a Promise in an async
function:

```js
async function asyncAwaitExample() {
  try {
    const savedDoc = await doc.save();
    console.log(savedDoc);
  } catch(err) {
    console.warn(err);
  }
}
```

This is the modern way of using Promises, which is easier to read since it looks
more procedural (while remaining asynchronous).



## Resources

* [Promises][promise]
* [Async/await][async-await]
* [JavaScript Promises][promise-course] (course slides)



[async-await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[es2017]: https://2ality.com/2016/02/ecmascript-2017.html
[mongoose]: https://mongoosejs.com
[mongoose-save]: https://mongoosejs.com/docs/api.html#document_Document-save
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[promise-course]: https://mediacomem.github.io/comem-webdev-docs/2020-2021/subjects/js-promises/?home=MediaComem%2Fcomem-archioweb%23readme#1
