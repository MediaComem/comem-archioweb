# JavaScript exercises

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Functions](#functions)
  - [Functions as arguments](#functions-as-arguments)
  - [Dynamically create functions](#dynamically-create-functions)
  - [Passing a function vs calling it](#passing-a-function-vs-calling-it)
  - [The `this` keyword](#the-this-keyword)
- [Check your JavaScript basics](#check-your-javascript-basics)
  - [Value or reference?](#value-or-reference)
  - [Equality and falsiness](#equality-and-falsiness)
  - [Strings and numbers](#strings-and-numbers)
  - [Transforming arrays](#transforming-arrays)
  - [Sorting](#sorting)
  - [Destructuring](#destructuring)
  - [Spread and rest](#spread-and-rest)
  - [Optional chaining and the nullish coalescing operator](#optional-chaining-and-the-nullish-coalescing-operator)
  - [Objects are not arrays](#objects-are-not-arrays)
  - [JSON](#json)
  - [Async functions](#async-functions)
  - [Errors in asynchronous code](#errors-in-asynchronous-code)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

These exercises are a way to **check your own knowledge of JavaScript** before
we start building web services with it.

The [Functions](#functions) exercises cover higher-level concepts that many
people find tricky, and that we will rely on throughout the course. Take your
time with them.

The [basics](#check-your-javascript-basics) that follow should each take you no
more than a few minutes. **If they do, you have what you need to follow this
course.** If any of them surprises you, go back to your JavaScript course or to
the extra JavaScript material of this course
([JavaScript](../subjects/js/README.md),
[closures](../subjects/js-closures/README.md),
[promises](../subjects/js-promises/README.md)): we will use all of these
concepts.

> All these exercises are plain JavaScript. You can run them in a CodePen, in
> your browser's developer console, or in any other JavaScript environment.

## Functions

### Functions as arguments

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/xxVzxEQ?editors=0011)

```js
// Let's define a couple of arithmetic function.
function add(a, b) {
  return a + b;
}
function multiply(a, b) {
  return a * b;
}

// Define a function that takes two numbers
// and a function to apply to those numbers.
function compute(/* TODO: give me some arguments! */) {
  // TODO: implement me!
}

// Call compute with "add".
let value = compute(2, 4, add);
console.log(value); // 6

// Call compute with "multiply".
value = compute(2, 4, multiply);
console.log(value); // 8
```

### Dynamically create functions

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/xxVzxYe?editors=0011)

```js
// Implement this function in a way that makes the rest of the code work.
function createMultiplier(/* TODO: give me some arguments! */) {
  // TODO: implement me!
}

const multiplyByTwo = createMultiplier(2);
console.log(multiplyByTwo(1)); // 2
console.log(multiplyByTwo(2)); // 4
console.log(multiplyByTwo(3)); // 6

const multiplyByFive = createMultiplier(5);
console.log(multiplyByFive(1)); // 5
console.log(multiplyByFive(2)); // 10
console.log(multiplyByFive(3)); // 15
```

> This type of function is called a
> [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

### Passing a function vs calling it

[Open in CodePen](https://codepen.io/editor/AlphaHydrae/pen/01a0a653-eceb-768d-9e5d-d1fc1a4877d2?console=true&file=%2Fscript.js&orientation=left&panel=files&show=split)

```js
function sayHello() {
  console.log('Hello!');
}

// This prints "Hello!" immediately instead of one second later,
// and it prints it only once even if you wait. Why?
setTimeout(sayHello(), 1000);

// TODO: fix the line above so that "Hello!" is printed once, after one second.
```

> Make sure you can explain **the difference between `sayHello` and
> `sayHello()`**. Later in this course you will constantly hand your functions
> over to other code that decides when to call them, and this is the single
> most common mistake when doing so.

### The [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) keyword

[Open in CodePen](TODO)

```js
const counter = {
  count: 0,

  // This method is supposed to increment the counter, but it doesn't.
  increment: () => {
    this.count++;
  }
};

counter.increment();
counter.increment();

console.log(counter.count); // should be 2
```

> TODO: make the counter work, **without changing anything outside of the
> definition of the counter object**. What is `this` in the code above, and what
> should it be?

## Check your JavaScript basics

### Value or reference?

[Open in CodePen](TODO)

```js
const original = { name: 'Alice', tags: ['admin'] };
const copy = original;

copy.name = 'Bob';
copy.tags.push('editor');

// 1. What do these two lines print? Why is this allowed even though
//    `original` and `copy` are both declared with `const`?
console.log(original.name);
console.log(original.tags);

// 2. TODO: edit the code above to make `copy` an actual copy, so that the first
//    of the two lines above prints "Alice" again.
```

> **Bonus:** with your copy in place, does `original.tags` still gain the
> `"editor"` tag? Why? Look up the difference between a **shallow** and a
> **deep** copy.

### [Equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) and [falsiness](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)

[Open in CodePen](TODO)

```js
// 1. Predict the value of each of these expressions, then check.
console.log(1 == '1');
console.log(1 === '1');
console.log(null == undefined);
console.log(null === undefined);
console.log([] == false);

// 2. This function should return true whenever a value has been provided, and
//    false only when there is no value at all. It gets two of these five cases
//    wrong. Which ones? TODO: fix it.
function hasValue(value) {
  return value ? true : false;
}

console.log(hasValue('hello'));
console.log(hasValue(0));
console.log(hasValue(''));
console.log(hasValue(null));
console.log(hasValue(undefined));
```

> Make sure you can list **all the falsy values** of JavaScript.

### Strings and [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

[Open in CodePen](TODO)

```js
// Values that come from outside your program (a form field, a URL, a text
// file...) are strings, even when they look like numbers.
const input = '10';

// 1. Predict what these two lines print. Why are they different?
console.log(input + 1);
console.log(input * 2);

// 2. TODO: fix this function so that it works with both '10' and 10.
function addTen(value) {
  return value + 10;
}

console.log(addTen('10')); // should be 20
console.log(addTen(10)); // should be 20
```

> **Bonus:** what does your fixed `addTen` return when you hand it `'abc'`, a
> value that is not a number at all? How would you detect that case?

### Transforming arrays

[Open in CodePen](TODO)

```js
const movies = [
  { title: 'The Matrix', year: 1999, rating: 8.7 },
  { title: 'Inception', year: 2010, rating: 8.8 },
  { title: 'Tenet', year: 2020, rating: 7.3 },
  { title: 'Memento', year: 2000, rating: 8.4 }
];

// Produce each of these WITHOUT writing a single `for` loop.

// 1. The list of titles:
//    [ "The Matrix", "Inception", "Tenet", "Memento" ]

// 2. Only the movies rated above 8.5.

// 3. The average rating of all the movies.
```

> You are looking for
> [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
> [`filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
> and
> [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).

### [Sorting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

[Open in CodePen](TODO)

```js
const values = [10, 9, 100, 1];

// 1. This does not print [ 1, 9, 10, 100 ]. What does it print, and why?
console.log(values.sort());

// 2. TODO: sort the values in ascending numerical order.

// 3. What is in `values` after sorting? Was the original array left untouched?

// 4. TODO: sort these movies by year, most recent first.
const movies = [
  { title: 'The Matrix', year: 1999 },
  { title: 'Inception', year: 2010 },
  { title: 'Memento', year: 2000 }
];
```

### [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/qBZKBXw?editors=0011)

```js
const options = { color: 'red', size: 42 };

// 1. TODO: replace these 3 lines with a single destructuring assignment,
//    keeping the same behaviour (including the default shape).
const color = options.color;
const size = options.size;
const shape = options.shape !== undefined ? options.shape : 'circle';

console.log(`A ${size}px ${color} ${shape}`); // "A 42px red circle"

// 2. TODO: use a destructuring assignment to get the first value and an array
//    of all the others, without modifying the last 2 lines.
const values = [23, 61, 42, 51, 12];

console.log(`The first value is ${firstValue}`);
console.log(`The other values are ${otherValues.join(', ')}`);
```

> **Bonus:** destructuring also works in a function's parameters. Write a
> `describe(options)` function that takes `{ color, size }` apart directly in
> its parameter list, so that `describe({ color: 'red', size: 42 })` logs
> `"A 42px red shape"`.

### [Spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) and [rest](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

[Open in CodePen](TODO)

```js
const defaults = { color: 'black', size: 10, shape: 'circle' };
const custom = { color: 'red' };

// 1. TODO: build an `options` object with all the default values, with the
//    custom values applied on top. Modify neither `defaults` nor `custom`.
const options = {}; // TODO: fix me!

console.log(options); // { color: "red", size: 10, shape: "circle" }

// 2. TODO: implement this function so that it accepts any number of arguments.
function sum(/* TODO: give me some arguments! */) {
  // TODO: implement me!
}

console.log(sum(1, 2)); // 3
console.log(sum(1, 2, 3, 4)); // 10
```

### [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) and the [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/PojQWKq?editors=0011)

```js
const bob = { name: 'Bob', address: null };
const alice = { name: 'Alice', address: { poBox: '000' } };
const chuck = { name: 'Chuck', address: { city: 'Dallas' } };

// TODO: simplify this function down to a single line, using optional chaining
// and the nullish coalescing operator.
function whereDoTheyLive(person) {
  if (!person) {
    return 'Unknown';
  }

  const address = person.address;
  if (!address) {
    return 'Unknown';
  }

  const city = address.city;
  if (!city) {
    return 'Unknown';
  }

  return city;
}

console.log(whereDoTheyLive(bob)); // "Unknown"
console.log(whereDoTheyLive(alice)); // "Unknown"
console.log(whereDoTheyLive(chuck)); // "Dallas"
```

> **Bonus:** these two lines do not always produce the same result. For which
> values of `value` do they differ?
>
> ```js
> const a = value ?? 'default';
> const b = value || 'default';
> ```

### Objects are not arrays

[Open in CodePen](TODO)

```js
const ratings = { matrix: 8.7, inception: 8.8, tenet: 7.3 };

// 1. This throws an error. Why?
ratings.forEach(rating => console.log(rating));

// 2. TODO: print each key with its value, e.g. "matrix: 8.7".

// 3. TODO: build an array of all the keys, then an array of all the values.

// 4. TODO: compute the average rating.

// 5. TODO: check whether `ratings` has an entry for "memento".
```

> Have a look at
> [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys),
> [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
> and
> [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries),
> and at the
> [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
> loop.

### [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/gOrKOKw?editors=0011)

```js
const personJson = '{"first":"James","last":"Bond"}';

// 1. TODO: extract the person's first and last names to new variables
//    to make this code work, without modifying the rest of the code.

console.log(`My name is ${last}, ${first} ${last}`);

// 2. TODO: turn this object into a JSON string.
const person = { first: 'James', last: 'Bond', licensed: true };
```

> JSON is the format in which your programs will exchange data with the rest of
> the world for the remainder of this course. Know what survives the trip.
>
> **Bonus:** not everything does. **Predict** what happens to each of these
> three values, then add the two lines to your pen and check:
>
> ```js
> const tricky = { when: new Date(), missing: undefined, greet: () => 'hi' };
> console.log(JSON.parse(JSON.stringify(tricky)));
> ```

### [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/bGpKaKx?editors=0011)

```js
advise();

// TODO: get rid of the .then calls and callback functions by using async/await.
function advise() {
  fetch('https://api.adviceslip.com/advice')
    .then(res => res.json())
    .then(({ slip: { advice } }) => console.log(advice));
}
```

> **Bonus:** once you have converted it, what does calling `advise()` return?
> And if you had three pieces of advice to fetch, how would you get them **all
> at the same time** instead of one after the other?

### Errors in asynchronous code

[Open in CodePen](TODO)

```js
// This function always fails half a second after being called.
function loadData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Network is down')), 500);
  });
}

// This is supposed to print "Caught: Network is down", but it prints something
// surprising and never reaches the catch block.
// Why? TODO: fix it.
async function attempt() {
  try {
    const data = loadData();
    console.log(data);
  } catch (err) {
    console.log('Caught:', err.message);
  }
}

attempt();
```

> Forgetting a single `await` is enough to make error handling silently stop
> working. Make sure you understand exactly why.
