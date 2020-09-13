# JavaScript exercises

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Fill the missing bits](#fill-the-missing-bits)
  - [Dynamically create functions](#dynamically-create-functions)
  - [Functions as arguments](#functions-as-arguments)
  - [Deserialize JSON](#deserialize-json)
- [ECMAScript 2015+](#ecmascript-2015)
  - [Template literals](#template-literals)
  - [Arrow functions](#arrow-functions)
  - [for...of](#forof)
  - [Array destructuring](#array-destructuring)
  - [Object destructuring](#object-destructuring)

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

### Deserialize JSON

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/gOrKOKw?editors=0011)

```js
const personJson = '{"first":"James","last":"Bond"}';

// Extract the person's first and last names to new variables
// to make this code work, without modifying the rest of the code.

console.log(`My name is ${last}, ${first}, ${last}`);
```



## ECMAScript 2015+

Learn how to use the modern JavaScript syntax.

### Template literals

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/PoNaoOG?editors=0011)

```js
const firstName = 'John';
const lastName = 'Doe';

// Use a template literal instead of string concatenation.
console.log('Hello, I am ' + firstName + ' ' + lastName + '!');
```

### Arrow functions

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/QWNxWdg?editors=0011)

```js
const people = [
  { first: "John", last: "Doe" },
  { first: "Bob", last: "Martin" },
  { first: "Alice", last: "Krauss" }
];

// Convert this function to an arrow function and save 2 lines.
const lastNames = people.map(function(person) {
  return person.last;
});

console.log(lastNames); // [ "Doe", "Martin", "Krauss" ]
```

### for...of

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/qBZKBVG?editors=0011)

```js
let fruits = [ 'apple', 'pear', 'lemon' ];

// Use a for...of loop instead of iterating with an index.
for (let i = 0; i < fruits.length; i++) {
  const fruit = fruits[i];
  console.log(`${fruit} is a fruit`);
}
```

### Array destructuring

[Open in CodePen](https://codepen.io/AlphaHydrae/pen/abNKbLX?editors=0011)

```js
const values = [ 23, 61, 42, 51, 12 ];

// Use a destructuring assignment to convert the next 2 lines
// to a single expression without modifying the rest of the code.
const firstValue = values[0];
const otherValues = values.slice(1);

console.log(`The first value is ${firstValue}`);
console.log(`The other values are ${otherValues.join(', ')}`);
```

### Object destructuring

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

function logHabitation(person) {
  // Use a destructuring assignment in the function's argument to
  // remove the next 2 lines, without modifying the console.log statement.
  const first = person.first;
  const city = person.address.city;
  console.log(`${first} lives in ${city}`);
}

logHabitation(person); // "John lives in Yverdon"
```
