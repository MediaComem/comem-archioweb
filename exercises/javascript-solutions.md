# JavaScript exercises solutions

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Fill the missing bits](#fill-the-missing-bits)
  - [Functions as arguments](#functions-as-arguments)
  - [Dynamically create functions](#dynamically-create-functions)
  - [Deserialize JSON](#deserialize-json)
- [ECMAScript 2015+](#ecmascript-2015)
  - [Template literals](#template-literals)
  - [Arrow functions](#arrow-functions)
  - [for...of](#forof)
  - [Array destructuring](#array-destructuring)
  - [Object destructuring](#object-destructuring)
  - [Optional chaining and the nullish coalescing operator](#optional-chaining-and-the-nullish-coalescing-operator)
  - [Async functions](#async-functions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Fill the missing bits

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
function compute(a, b, func) {
  return func(a, b);
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
function createMultiplier(factor) {
  return number => number * factor;
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

### [Deserialize JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/gOrKOKw?editors=0011)

```js
const personJson = '{"first":"James","last":"Bond"}';

// Extract the person's first and last names to new variables
// to make this code work, without modifying the rest of the code.
const { first, last } = JSON.parse(personJson);

console.log(`My name is ${last}, ${first}, ${last}`);
```



## ECMAScript 2015+

### [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/PoNaoOG?editors=0011)

```js
const firstName = 'John';
const lastName = 'Doe';

// Use a template literal instead of string concatenation.
console.log(`Hello, I am ${firstName} ${lastName}!`);
```

### [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/QWNxWdg?editors=0011)

```js
const people = [
  { first: "John", last: "Doe" },
  { first: "Bob", last: "Martin" },
  { first: "Alice", last: "Krauss" }
];

// Convert this function to an arrow function and save 2 lines.
const lastNames = people.map(person => person.last);

console.log(lastNames); // [ "Doe", "Martin", "Krauss" ]
```

### [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/qBZKBVG?editors=0011)

```js
let fruits = [ 'apple', 'pear', 'lemon' ];

// Use a for...of loop instead of iterating with an index.
for (let fruit of fruits) {
  console.log(`${fruit} is a fruit`);
}
```

### Array [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/abNKbLX?editors=0011)

```js
const values = [ 23, 61, 42, 51, 12 ];

// Use a destructuring assignment to convert the next 2 lines
// to a single expression without modifying the rest of the code.
const [ firstValue, ...otherValues ] = values;

console.log(`The first value is ${firstValue}`);
console.log(`The other values are ${otherValues.join(', ')}`);
```

### Object [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/qBZKBXw?editors=0011)

```js
const person = {
  first: 'John',
  last: 'Doe',
  address: {
    city: 'Yverdon',
    street: 'Avenue des Sports',
    zip: 1400
  }
};

function logHabitation({ first, address: { city }}) {
  // Use a destructuring assignment in the function's argument to
  // remove the next 2 lines, without modifying the console.log statement.
  console.log(`${first} lives in ${city}`);
}

logHabitation(person); // "John lives in Yverdon"
```

### [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) and the [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/PojQWKq?editors=0011)

```js
const bob = {
  name: 'Bob',
  address: null
};

const alice = {
  name: 'Alice',
  address: {
    poBox: '000'
  }
};

const chuck = {
  name: 'Chuck',
  address: {
    city: 'Dallas'
  }
}

// Simplify this function using optional chaining and the nullish coalescing
// operator.
function whereDoTheyLive(person) {
  return person?.address?.city ?? 'Unknown';
}

console.log(whereDoTheyLive(bob));    // "Unknown"
console.log(whereDoTheyLive(alice));  // "Unknown"
console.log(whereDoTheyLive(chuck));  // "Dallas"
```

### [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/bGpKaKx?editors=0011)

```js
advise();

// Get rid of the .then calls and callback functions by using async/await.
async function advise() {
  const res = await fetch('https://api.adviceslip.com/advice');
  const { slip: { advice } } = await res.json();
  console.log(advice);
}
```
