# JavaScript exercises solutions

These are the solutions to the [JavaScript exercises](javascript.md). Answers to
the "predict" and "why" questions are written as comments in the code, next to
the line they are about.

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

## Functions

### Functions as arguments

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+Let%27s+define+a+couple+of+arithmetic+function.%0Afunction+add%28a%2C+b%29+%7B%0A++return+a+%2B+b%3B%0A%7D%0Afunction+multiply%28a%2C+b%29+%7B%0A++return+a+*+b%3B%0A%7D%0A%0A%2F%2F+Define+a+function+that+takes+two+numbers%0A%2F%2F+and+a+function+to+apply+to+those+numbers.%0Afunction+compute%28a%2C+b%2C+operation%29+%7B%0A++return+operation%28a%2C+b%29%3B%0A%7D%0A%0A%2F%2F+Call+compute+with+%22add%22.%0Alet+value+%3D+compute%282%2C+4%2C+add%29%3B%0Aconsole.log%28value%29%3B+%2F%2F+6%0A%0A%2F%2F+Call+compute+with+%22multiply%22.%0Avalue+%3D+compute%282%2C+4%2C+multiply%29%3B%0Aconsole.log%28value%29%3B+%2F%2F+8&console=open&welcome=false&recoverUnsaved=false&title=Functions+as+arguments)

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
function compute(a, b, operation) {
  return operation(a, b);
}

// Call compute with "add".
let value = compute(2, 4, add);
console.log(value); // 6

// Call compute with "multiply".
value = compute(2, 4, multiply);
console.log(value); // 8
```

### Dynamically create functions

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+Implement+this+function+in+a+way+that+makes+the+rest+of+the+code+work.%0Afunction+createMultiplier%28factor%29+%7B%0A++%2F%2F+The+returned+function+still+has+access+to+%60factor%60+after+createMultiplier%0A++%2F%2F+has+returned.%0A++return+number+%3D%3E+number+*+factor%3B%0A%7D%0A%0Aconst+multiplyByTwo+%3D+createMultiplier%282%29%3B%0Aconsole.log%28multiplyByTwo%281%29%29%3B+%2F%2F+2%0Aconsole.log%28multiplyByTwo%282%29%29%3B+%2F%2F+4%0Aconsole.log%28multiplyByTwo%283%29%29%3B+%2F%2F+6%0A%0Aconst+multiplyByFive+%3D+createMultiplier%285%29%3B%0Aconsole.log%28multiplyByFive%281%29%29%3B+%2F%2F+5%0Aconsole.log%28multiplyByFive%282%29%29%3B+%2F%2F+10%0Aconsole.log%28multiplyByFive%283%29%29%3B+%2F%2F+15&console=open&welcome=false&recoverUnsaved=false&title=Dynamically+create+functions)

```js
// Implement this function in a way that makes the rest of the code work.
function createMultiplier(factor) {
  // The returned function still has access to `factor` after createMultiplier
  // has returned.
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

### Passing a function vs calling it

[Open in LiveCodes](https://livecodes.io/?js=function+sayHello%28%29+%7B%0A++console.log%28%27Hello%21%27%29%3B%0A%7D%0A%0A%2F%2F+%60sayHello%28%29%60+calls+the+function+right+away%2C+which+prints+%22Hello%21%22%0A%2F%2F+immediately%2C+and+passes+its+return+value+%28%60undefined%60%29+to+setTimeout%2C+which%0A%2F%2F+then+has+no+function+to+call+one+second+later.%0A%2F%2F%0A%2F%2F+%60sayHello%60+%28without+parentheses%29+passes+the+function+itself%2C+and+lets%0A%2F%2F+setTimeout+decide+when+to+call+it.%0AsetTimeout%28sayHello%2C+1000%29%3B&console=open&welcome=false&recoverUnsaved=false&title=Passing+a+function+vs+calling+it)

```js
function sayHello() {
  console.log('Hello!');
}

// `sayHello()` calls the function right away, which prints "Hello!"
// immediately, and passes its return value (`undefined`) to setTimeout, which
// then has no function to call one second later.
//
// `sayHello` (without parentheses) passes the function itself, and lets
// setTimeout decide when to call it.
setTimeout(sayHello, 1000);
```

> `sayHello` is the function, a value like any other. `sayHello()` is the result
> of calling it. (Node.js is stricter than browsers here: `setTimeout(undefined,
1000)` throws a `TypeError` instead of silently doing nothing.)

### The [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) keyword

[Open in LiveCodes](https://livecodes.io/?js=const+counter+%3D+%7B%0A++count%3A+0%2C%0A%0A++%2F%2F+A+regular+method%3A+when+called+as+%60counter.increment%28%29%60%2C+%60this%60+is+the%0A++%2F%2F+object+before+the+dot%2C+i.e.+%60counter%60.%0A++increment%28%29+%7B%0A++++this.count%2B%2B%3B%0A++%7D%0A%7D%3B%0A%0Acounter.increment%28%29%3B%0Acounter.increment%28%29%3B%0A%0Aconsole.log%28counter.count%29%3B+%2F%2F+2&console=open&welcome=false&recoverUnsaved=false&title=The+this+keyword)

```js
const counter = {
  count: 0,

  // A regular method: when called as `counter.increment()`, `this` is the
  // object before the dot, i.e. `counter`.
  increment() {
    this.count++;
  }
};

counter.increment();
counter.increment();

console.log(counter.count); // 2
```

> An arrow function does not have its own `this`: it uses the `this` of the code
> around it, here the top level of the script, which is not `counter` (it is
> `undefined` in a module, or the global object in a classic script). `this`
> should be the object the method is called on, which requires a regular
> function, written here with the method shorthand (`increment: function () {
... }` works too).

## Check your JavaScript basics

### Value or reference?

[Open in LiveCodes](https://livecodes.io/?js=const+original+%3D+%7B+name%3A+%27Alice%27%2C+tags%3A+%5B%27admin%27%5D+%7D%3B%0A%2F%2F+The+spread+syntax+creates+a+new+object+with+the+same+properties.%0Aconst+copy+%3D+%7B+...original+%7D%3B%0A%0Acopy.name+%3D+%27Bob%27%3B%0Acopy.tags.push%28%27editor%27%29%3B%0A%0A%2F%2F+1.+Before+the+fix%2C+these+lines+printed+%22Bob%22+and+%5B+%22admin%22%2C+%22editor%22+%5D%3A%0A%2F%2F++++%60copy+%3D+original%60+does+not+copy+anything%2C+it+makes+both+variables+refer+to%0A%2F%2F++++the+same+object.+%60const%60+only+prevents+re-assigning+a+variable%2C+not%0A%2F%2F++++modifying+the+object+it+refers+to.%0Aconsole.log%28original.name%29%3B+%2F%2F+%22Alice%22%0Aconsole.log%28original.tags%29%3B+%2F%2F+%5B+%22admin%22%2C+%22editor%22+%5D%0A%0A%2F%2F+Bonus%3A+a+deep+copy+also+copies+the+nested+objects+and+arrays.%0Aconst+deepCopy+%3D+structuredClone%28original%29%3B%0AdeepCopy.tags.push%28%27viewer%27%29%3B%0Aconsole.log%28original.tags%29%3B+%2F%2F+still+%5B+%22admin%22%2C+%22editor%22+%5D&console=open&welcome=false&recoverUnsaved=false&title=Value+or+reference%3F)

```js
const original = { name: 'Alice', tags: ['admin'] };
// The spread syntax creates a new object with the same properties.
const copy = { ...original };

copy.name = 'Bob';
copy.tags.push('editor');

// 1. Before the fix, these lines printed "Bob" and [ "admin", "editor" ]:
//    `copy = original` does not copy anything, it makes both variables refer to
//    the same object. `const` only prevents re-assigning a variable, not
//    modifying the object it refers to.
console.log(original.name); // "Alice"
console.log(original.tags); // [ "admin", "editor" ]

// Bonus: a deep copy also copies the nested objects and arrays.
const deepCopy = structuredClone(original);
deepCopy.tags.push('viewer');
console.log(original.tags); // still [ "admin", "editor" ]
```

> **Bonus:** yes, `original.tags` still gains the `"editor"` tag. `{ ...original
}` is a **shallow** copy: it creates a new object, but its `tags` property
> refers to the same array as the original's. A **deep** copy, e.g. with
> [`structuredClone()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone),
> also copies everything nested inside.

### [Equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) and [falsiness](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+1.+%60%3D%3D%60+converts+its+operands+to+the+same+type+before+comparing%2C+%60%3D%3D%3D%60+does%0A%2F%2F++++not.%0Aconsole.log%281+%3D%3D+%271%27%29%3B+%2F%2F+true%3A+%271%27+is+converted+to+1%0Aconsole.log%281+%3D%3D%3D+%271%27%29%3B+%2F%2F+false%3A+a+number+is+never+strictly+equal+to+a+string%0Aconsole.log%28null+%3D%3D+undefined%29%3B+%2F%2F+true%3A+a+special+case+of+%60%3D%3D%60%0Aconsole.log%28null+%3D%3D%3D+undefined%29%3B+%2F%2F+false%3A+they+are+two+different+values%0Aconsole.log%28%5B%5D+%3D%3D+false%29%3B+%2F%2F+true%3A+both+are+converted+to+the+number+0%0A%0A%2F%2F+2.+It+returned+false+for+0+and+%27%27%2C+which+are+values%2C+but+falsy+ones.+Compare%0A%2F%2F++++with+null+and+undefined+explicitly+instead.%0Afunction+hasValue%28value%29+%7B%0A++return+value+%21%3D%3D+null+%26%26+value+%21%3D%3D+undefined%3B%0A%7D%0A%0Aconsole.log%28hasValue%28%27hello%27%29%29%3B+%2F%2F+true%0Aconsole.log%28hasValue%280%29%29%3B+%2F%2F+true%0Aconsole.log%28hasValue%28%27%27%29%29%3B+%2F%2F+true%0Aconsole.log%28hasValue%28null%29%29%3B+%2F%2F+false%0Aconsole.log%28hasValue%28undefined%29%29%3B+%2F%2F+false&console=open&welcome=false&recoverUnsaved=false&title=Equality+and+falsiness)

```js
// 1. `==` converts its operands to the same type before comparing, `===` does
//    not.
console.log(1 == '1'); // true: '1' is converted to 1
console.log(1 === '1'); // false: a number is never strictly equal to a string
console.log(null == undefined); // true: a special case of `==`
console.log(null === undefined); // false: they are two different values
console.log([] == false); // true: both are converted to the number 0

// 2. It returned false for 0 and '', which are values, but falsy ones. Compare
//    with null and undefined explicitly instead.
function hasValue(value) {
  return value !== null && value !== undefined;
}

console.log(hasValue('hello')); // true
console.log(hasValue(0)); // true
console.log(hasValue('')); // true
console.log(hasValue(null)); // false
console.log(hasValue(undefined)); // false
```

> The falsy values are `false`, `0`, `-0`, `0n`, `''` (the empty string),
> `null`, `undefined` and `NaN`. Every other value is truthy, including `[]`,
> `{}` and `'0'`.
>
> `value != null` would also work (thanks to the special case above), but
> spelling out both comparisons is clearer.

### Strings and [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+Values+that+come+from+outside+your+program+%28a+form+field%2C+a+URL%2C+a+text%0A%2F%2F+file...%29+are+strings%2C+even+when+they+look+like+numbers.%0Aconst+input+%3D+%2710%27%3B%0A%0A%2F%2F+1.+%60%2B%60+concatenates+as+soon+as+one+of+its+operands+is+a+string%2C+while+%60*%60%0A%2F%2F++++only+works+with+numbers+and+converts+the+string.%0Aconsole.log%28input+%2B+1%29%3B+%2F%2F+%22101%22%0Aconsole.log%28input+*+2%29%3B+%2F%2F+20%0A%0A%2F%2F+2.+Convert+the+value+to+a+number+first.%0Afunction+addTen%28value%29+%7B%0A++return+Number%28value%29+%2B+10%3B%0A%7D%0A%0Aconsole.log%28addTen%28%2710%27%29%29%3B+%2F%2F+20%0Aconsole.log%28addTen%2810%29%29%3B+%2F%2F+20%0A%0A%2F%2F+Bonus%3A+%27abc%27+is+not+a+number%2C+so+the+result+is+NaN+%28%22Not+a+Number%22%29.%0Aconst+result+%3D+addTen%28%27abc%27%29%3B%0Aconsole.log%28result%29%3B+%2F%2F+NaN%0Aconsole.log%28Number.isNaN%28result%29%29%3B+%2F%2F+true&console=open&welcome=false&recoverUnsaved=false&title=Strings+and+numbers)

```js
// Values that come from outside your program (a form field, a URL, a text
// file...) are strings, even when they look like numbers.
const input = '10';

// 1. `+` concatenates as soon as one of its operands is a string, while `*`
//    only works with numbers and converts the string.
console.log(input + 1); // "101"
console.log(input * 2); // 20

// 2. Convert the value to a number first.
function addTen(value) {
  return Number(value) + 10;
}

console.log(addTen('10')); // 20
console.log(addTen(10)); // 20

// Bonus: 'abc' is not a number, so the result is NaN ("Not a Number").
const result = addTen('abc');
console.log(result); // NaN
console.log(Number.isNaN(result)); // true
```

> **Bonus:** `addTen('abc')` returns `NaN`. Check for it with
> [`Number.isNaN()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN):
> `NaN === NaN` is `false`, so a simple comparison does not work. Also note that
> `Number('')` is `0`, not `NaN`, so an empty form field would silently count as
> zero.

### Transforming arrays

[Open in LiveCodes](https://livecodes.io/?js=const+movies+%3D+%5B%0A++%7B+title%3A+%27The+Matrix%27%2C+year%3A+1999%2C+rating%3A+8.7+%7D%2C%0A++%7B+title%3A+%27Inception%27%2C+year%3A+2010%2C+rating%3A+8.8+%7D%2C%0A++%7B+title%3A+%27Tenet%27%2C+year%3A+2020%2C+rating%3A+7.3+%7D%2C%0A++%7B+title%3A+%27Memento%27%2C+year%3A+2000%2C+rating%3A+8.4+%7D%0A%5D%3B%0A%0A%2F%2F+1.+The+list+of+titles.%0Aconst+titles+%3D+movies.map%28movie+%3D%3E+movie.title%29%3B%0Aconsole.log%28titles%29%3B+%2F%2F+%5B+%22The+Matrix%22%2C+%22Inception%22%2C+%22Tenet%22%2C+%22Memento%22+%5D%0A%0A%2F%2F+2.+Only+the+movies+rated+above+8.5.%0Aconst+bestMovies+%3D+movies.filter%28movie+%3D%3E+movie.rating+%3E+8.5%29%3B%0Aconsole.log%28bestMovies%29%3B+%2F%2F+The+Matrix+and+Inception%0A%0A%2F%2F+3.+The+average+rating+of+all+the+movies.%0Aconst+totalRating+%3D+movies.reduce%28%28total%2C+movie%29+%3D%3E+total+%2B+movie.rating%2C+0%29%3B%0Aconst+averageRating+%3D+totalRating+%2F+movies.length%3B%0Aconsole.log%28averageRating%29%3B+%2F%2F+8.3&console=open&welcome=false&recoverUnsaved=false&title=Transforming+arrays)

```js
const movies = [
  { title: 'The Matrix', year: 1999, rating: 8.7 },
  { title: 'Inception', year: 2010, rating: 8.8 },
  { title: 'Tenet', year: 2020, rating: 7.3 },
  { title: 'Memento', year: 2000, rating: 8.4 }
];

// 1. The list of titles.
const titles = movies.map(movie => movie.title);
console.log(titles); // [ "The Matrix", "Inception", "Tenet", "Memento" ]

// 2. Only the movies rated above 8.5.
const bestMovies = movies.filter(movie => movie.rating > 8.5);
console.log(bestMovies); // The Matrix and Inception

// 3. The average rating of all the movies.
const totalRating = movies.reduce((total, movie) => total + movie.rating, 0);
const averageRating = totalRating / movies.length;
console.log(averageRating); // 8.3
```

> None of these methods modifies the original array: each returns a new value.

### [Sorting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

[Open in LiveCodes](https://livecodes.io/?js=const+values+%3D+%5B10%2C+9%2C+100%2C+1%5D%3B%0A%0A%2F%2F+1.+It+prints+%5B+1%2C+10%2C+100%2C+9+%5D%3A+by+default%2C+sort%28%29+converts+the+values+to%0A%2F%2F++++strings+and+sorts+them+alphabetically%2C+and+%22100%22+comes+before+%229%22.%0Aconsole.log%28values.sort%28%29%29%3B%0A%0A%2F%2F+2.+Pass+a+compare+function%3A+a+negative+result+puts+%60a%60+first%2C+a+positive%0A%2F%2F++++one+puts+%60b%60+first.%0Avalues.sort%28%28a%2C+b%29+%3D%3E+a+-+b%29%3B%0Aconsole.log%28values%29%3B+%2F%2F+%5B+1%2C+9%2C+10%2C+100+%5D%0A%0A%2F%2F+3.+%60values%60+itself+is+now+sorted%3A+sort%28%29+modifies+the+array+in+place+%28and%0A%2F%2F++++returns+that+same+array%29.+The+original+order+is+lost.+Use+toSorted%28%29+to%0A%2F%2F++++get+a+sorted+copy+instead.%0Aconst+descending+%3D+values.toSorted%28%28a%2C+b%29+%3D%3E+b+-+a%29%3B%0Aconsole.log%28descending%29%3B+%2F%2F+%5B+100%2C+10%2C+9%2C+1+%5D%0Aconsole.log%28values%29%3B+%2F%2F+still+%5B+1%2C+9%2C+10%2C+100+%5D%0A%0A%2F%2F+4.+Most+recent+first%3A+compare+the+years+in+reverse+order.%0Aconst+movies+%3D+%5B%0A++%7B+title%3A+%27The+Matrix%27%2C+year%3A+1999+%7D%2C%0A++%7B+title%3A+%27Inception%27%2C+year%3A+2010+%7D%2C%0A++%7B+title%3A+%27Memento%27%2C+year%3A+2000+%7D%0A%5D%3B%0A%0Aconst+moviesByYear+%3D+movies.toSorted%28%28a%2C+b%29+%3D%3E+b.year+-+a.year%29%3B%0Aconsole.log%28moviesByYear%29%3B+%2F%2F+Inception%2C+Memento%2C+The+Matrix&console=open&welcome=false&recoverUnsaved=false&title=Sorting)

```js
const values = [10, 9, 100, 1];

// 1. It prints [ 1, 10, 100, 9 ]: by default, sort() converts the values to
//    strings and sorts them alphabetically, and "100" comes before "9".
console.log(values.sort());

// 2. Pass a compare function: a negative result puts `a` first, a positive
//    one puts `b` first.
values.sort((a, b) => a - b);
console.log(values); // [ 1, 9, 10, 100 ]

// 3. `values` itself is now sorted: sort() modifies the array in place (and
//    returns that same array). The original order is lost. Use toSorted() to
//    get a sorted copy instead.
const descending = values.toSorted((a, b) => b - a);
console.log(descending); // [ 100, 10, 9, 1 ]
console.log(values); // still [ 1, 9, 10, 100 ]

// 4. Most recent first: compare the years in reverse order.
const movies = [
  { title: 'The Matrix', year: 1999 },
  { title: 'Inception', year: 2010 },
  { title: 'Memento', year: 2000 }
];

const moviesByYear = movies.toSorted((a, b) => b.year - a.year);
console.log(moviesByYear); // Inception, Memento, The Matrix
```

### [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

[Open in LiveCodes](https://livecodes.io/?js=const+options+%3D+%7B+color%3A+%27red%27%2C+size%3A+42+%7D%3B%0A%0A%2F%2F+1.+The+default+value+is+used+only+when+the+property+is+undefined%2C+exactly%0A%2F%2F++++like+the+original+code.%0Aconst+%7B+color%2C+size%2C+shape+%3D+%27circle%27+%7D+%3D+options%3B%0A%0Aconsole.log%28%60A+%24%7Bsize%7Dpx+%24%7Bcolor%7D+%24%7Bshape%7D%60%29%3B+%2F%2F+%22A+42px+red+circle%22%0A%0A%2F%2F+2.+The+rest+element+collects+all+the+remaining+values+into+a+new+array.%0Aconst+values+%3D+%5B23%2C+61%2C+42%2C+51%2C+12%5D%3B%0Aconst+%5BfirstValue%2C+...otherValues%5D+%3D+values%3B%0A%0Aconsole.log%28%60The+first+value+is+%24%7BfirstValue%7D%60%29%3B+%2F%2F+23%0Aconsole.log%28%60The+other+values+are+%24%7BotherValues.join%28%27%2C+%27%29%7D%60%29%3B+%2F%2F+61%2C+42%2C+51%2C+12%0A%0A%2F%2F+Bonus%3A+destructuring+in+the+parameter+list.%0Afunction+describe%28%7B+color%2C+size+%7D%29+%7B%0A++console.log%28%60A+%24%7Bsize%7Dpx+%24%7Bcolor%7D+shape%60%29%3B%0A%7D%0A%0Adescribe%28%7B+color%3A+%27red%27%2C+size%3A+42+%7D%29%3B+%2F%2F+%22A+42px+red+shape%22&console=open&welcome=false&recoverUnsaved=false&title=Destructuring)

```js
const options = { color: 'red', size: 42 };

// 1. The default value is used only when the property is undefined, exactly
//    like the original code.
const { color, size, shape = 'circle' } = options;

console.log(`A ${size}px ${color} ${shape}`); // "A 42px red circle"

// 2. The rest element collects all the remaining values into a new array.
const values = [23, 61, 42, 51, 12];
const [firstValue, ...otherValues] = values;

console.log(`The first value is ${firstValue}`); // 23
console.log(`The other values are ${otherValues.join(', ')}`); // 61, 42, 51, 12

// Bonus: destructuring in the parameter list.
function describe({ color, size }) {
  console.log(`A ${size}px ${color} shape`);
}

describe({ color: 'red', size: 42 }); // "A 42px red shape"
```

### [Spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) and [rest](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

[Open in LiveCodes](https://livecodes.io/?js=const+defaults+%3D+%7B+color%3A+%27black%27%2C+size%3A+10%2C+shape%3A+%27circle%27+%7D%3B%0Aconst+custom+%3D+%7B+color%3A+%27red%27+%7D%3B%0A%0A%2F%2F+1.+Spread+both+objects+into+a+new+one.+When+a+property+appears+twice%2C+the%0A%2F%2F++++last+one+wins%2C+so+the+custom+values+must+come+last.%0Aconst+options+%3D+%7B+...defaults%2C+...custom+%7D%3B%0A%0Aconsole.log%28options%29%3B+%2F%2F+%7B+color%3A+%22red%22%2C+size%3A+10%2C+shape%3A+%22circle%22+%7D%0A%0A%2F%2F+2.+A+rest+parameter+collects+all+the+arguments+into+an+array.%0Afunction+sum%28...numbers%29+%7B%0A++return+numbers.reduce%28%28total%2C+number%29+%3D%3E+total+%2B+number%2C+0%29%3B%0A%7D%0A%0Aconsole.log%28sum%281%2C+2%29%29%3B+%2F%2F+3%0Aconsole.log%28sum%281%2C+2%2C+3%2C+4%29%29%3B+%2F%2F+10&console=open&welcome=false&recoverUnsaved=false&title=Spread+and+rest)

```js
const defaults = { color: 'black', size: 10, shape: 'circle' };
const custom = { color: 'red' };

// 1. Spread both objects into a new one. When a property appears twice, the
//    last one wins, so the custom values must come last.
const options = { ...defaults, ...custom };

console.log(options); // { color: "red", size: 10, shape: "circle" }

// 2. A rest parameter collects all the arguments into an array.
function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}

console.log(sum(1, 2)); // 3
console.log(sum(1, 2, 3, 4)); // 10
```

### [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) and the [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

[Open in LiveCodes](https://livecodes.io/?js=const+bob+%3D+%7B+name%3A+%27Bob%27%2C+address%3A+null+%7D%3B%0Aconst+alice+%3D+%7B+name%3A+%27Alice%27%2C+address%3A+%7B+poBox%3A+%27000%27+%7D+%7D%3B%0Aconst+chuck+%3D+%7B+name%3A+%27Chuck%27%2C+address%3A+%7B+city%3A+%27Dallas%27+%7D+%7D%3B%0A%0A%2F%2F+%60%3F.%60+stops+and+produces+undefined+as+soon+as+the+value+on+its+left+is+null%0A%2F%2F+or+undefined%2C+and+%60%3F%3F%60+then+replaces+that+with+the+default+value.%0Afunction+whereDoTheyLive%28person%29+%7B%0A++return+person%3F.address%3F.city+%3F%3F+%27Unknown%27%3B%0A%7D%0A%0Aconsole.log%28whereDoTheyLive%28bob%29%29%3B+%2F%2F+%22Unknown%22%0Aconsole.log%28whereDoTheyLive%28alice%29%29%3B+%2F%2F+%22Unknown%22%0Aconsole.log%28whereDoTheyLive%28chuck%29%29%3B+%2F%2F+%22Dallas%22&console=open&welcome=false&recoverUnsaved=false&title=Optional+chaining+and+the+nullish+coalescing+operator)

```js
const bob = { name: 'Bob', address: null };
const alice = { name: 'Alice', address: { poBox: '000' } };
const chuck = { name: 'Chuck', address: { city: 'Dallas' } };

// `?.` stops and produces undefined as soon as the value on its left is null
// or undefined, and `??` then replaces that with the default value.
function whereDoTheyLive(person) {
  return person?.address?.city ?? 'Unknown';
}

console.log(whereDoTheyLive(bob)); // "Unknown"
console.log(whereDoTheyLive(alice)); // "Unknown"
console.log(whereDoTheyLive(chuck)); // "Dallas"
```

> **Bonus:** `??` only falls back to the default for `null` and `undefined`,
> while `||` falls back for **any** falsy value. The two lines differ when
> `value` is `false`, `0`, `-0`, `0n`, `''` or `NaN`: for example, with `value
= 0`, `a` is `0` but `b` is `'default'`.
>
> This is also the one (tiny) difference between the one-liner above and the
> original function, which used `!city` and therefore also answered `'Unknown'`
> for a city that is an empty string.

### Objects are not arrays

[Open in LiveCodes](https://livecodes.io/?js=const+ratings+%3D+%7B+matrix%3A+8.7%2C+inception%3A+8.8%2C+tenet%3A+7.3+%7D%3B%0A%0A%2F%2F+1.+forEach+is+a+method+of+arrays%2C+and+a+plain+object+is+not+an+array%3A+it+has%0A%2F%2F++++no+forEach+method%2C+so+this+throws+%22TypeError%3A+ratings.forEach+is+not+a%0A%2F%2F++++function%22.%0A%2F%2F+ratings.forEach%28rating+%3D%3E+console.log%28rating%29%29%3B%0A%0A%2F%2F+2.+Object.entries%28%29+gives+an+array+of+%5Bkey%2C+value%5D+pairs.%0Afor+%28const+%5Bkey%2C+value%5D+of+Object.entries%28ratings%29%29+%7B%0A++console.log%28%60%24%7Bkey%7D%3A+%24%7Bvalue%7D%60%29%3B%0A%7D%0A%0A%2F%2F+3.+The+keys%2C+then+the+values.%0Aconst+keys+%3D+Object.keys%28ratings%29%3B%0Aconsole.log%28keys%29%3B+%2F%2F+%5B+%22matrix%22%2C+%22inception%22%2C+%22tenet%22+%5D%0Aconst+values+%3D+Object.values%28ratings%29%3B%0Aconsole.log%28values%29%3B+%2F%2F+%5B+8.7%2C+8.8%2C+7.3+%5D%0A%0A%2F%2F+4.+Once+you+have+an+array%2C+the+usual+array+methods+work.%0Aconst+average+%3D%0A++values.reduce%28%28total%2C+rating%29+%3D%3E+total+%2B+rating%2C+0%29+%2F+values.length%3B%0Aconsole.log%28average%29%3B+%2F%2F+8.266666666666667%0A%0A%2F%2F+5.+Check+whether+the+object+itself+has+a+%22memento%22+property.%0Aconsole.log%28Object.hasOwn%28ratings%2C+%27memento%27%29%29%3B+%2F%2F+false&console=open&welcome=false&recoverUnsaved=false&title=Objects+are+not+arrays)

```js
const ratings = { matrix: 8.7, inception: 8.8, tenet: 7.3 };

// 1. forEach is a method of arrays, and a plain object is not an array: it has
//    no forEach method, so this throws "TypeError: ratings.forEach is not a
//    function".
// ratings.forEach(rating => console.log(rating));

// 2. Object.entries() gives an array of [key, value] pairs.
for (const [key, value] of Object.entries(ratings)) {
  console.log(`${key}: ${value}`);
}

// 3. The keys, then the values.
const keys = Object.keys(ratings);
console.log(keys); // [ "matrix", "inception", "tenet" ]
const values = Object.values(ratings);
console.log(values); // [ 8.7, 8.8, 7.3 ]

// 4. Once you have an array, the usual array methods work.
const average =
  values.reduce((total, rating) => total + rating, 0) / values.length;
console.log(average); // 8.266666666666667

// 5. Check whether the object itself has a "memento" property.
console.log(Object.hasOwn(ratings, 'memento')); // false
```

> `'memento' in ratings` also works here, but it looks at inherited properties
> too: `'toString' in ratings` is `true`, `Object.hasOwn(ratings, 'toString')`
> is `false`.

### [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

[Open in LiveCodes](https://livecodes.io/?js=const+personJson+%3D+%27%7B%22first%22%3A%22James%22%2C%22last%22%3A%22Bond%22%7D%27%3B%0A%0A%2F%2F+1.+Parse+the+JSON+string+into+an+object%2C+then+destructure+it.%0Aconst+%7B+first%2C+last+%7D+%3D+JSON.parse%28personJson%29%3B%0A%0Aconsole.log%28%60My+name+is+%24%7Blast%7D%2C+%24%7Bfirst%7D+%24%7Blast%7D%60%29%3B%0A%0A%2F%2F+2.+Serialize+the+object+into+a+JSON+string.%0Aconst+person+%3D+%7B+first%3A+%27James%27%2C+last%3A+%27Bond%27%2C+licensed%3A+true+%7D%3B%0Aconst+json+%3D+JSON.stringify%28person%29%3B%0Aconsole.log%28json%29%3B+%2F%2F+%27%7B%22first%22%3A%22James%22%2C%22last%22%3A%22Bond%22%2C%22licensed%22%3Atrue%7D%27%0A%0A%2F%2F+Bonus.%0Aconst+tricky+%3D+%7B+when%3A+new+Date%28%29%2C+missing%3A+undefined%2C+greet%3A+%28%29+%3D%3E+%27hi%27+%7D%3B%0Aconsole.log%28JSON.parse%28JSON.stringify%28tricky%29%29%29%3B+%2F%2F+%7B+when%3A+%222026-...%22+%7D&console=open&welcome=false&recoverUnsaved=false&title=JSON)

```js
const personJson = '{"first":"James","last":"Bond"}';

// 1. Parse the JSON string into an object, then destructure it.
const { first, last } = JSON.parse(personJson);

console.log(`My name is ${last}, ${first} ${last}`);

// 2. Serialize the object into a JSON string.
const person = { first: 'James', last: 'Bond', licensed: true };
const json = JSON.stringify(person);
console.log(json); // '{"first":"James","last":"Bond","licensed":true}'

// Bonus.
const tricky = { when: new Date(), missing: undefined, greet: () => 'hi' };
console.log(JSON.parse(JSON.stringify(tricky))); // { when: "2026-..." }
```

> **Bonus:** JSON only has strings, numbers, booleans, `null`, arrays and
> objects:
>
> - The date becomes a **string** in ISO 8601 format (e.g.
>   `"2026-09-15T09:00:31.000Z"`). Parsing it back gives a string, not a `Date`:
>   you have to convert it yourself with `new Date(...)`.
> - The property with an `undefined` value **disappears**.
> - The function **disappears** too: code cannot be sent as JSON.

### [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

[Open in LiveCodes](https://livecodes.io/?js=advise%28%29%3B%0A%0Aasync+function+advise%28%29+%7B%0A++const+res+%3D+await+fetch%28%27https%3A%2F%2Fapi.adviceslip.com%2Fadvice%27%29%3B%0A++const+%7B%0A++++slip%3A+%7B+advice+%7D%0A++%7D+%3D+await+res.json%28%29%3B%0A++console.log%28advice%29%3B%0A%7D%0A%0A%2F%2F+Bonus%3A+start+all+the+requests+first%2C+then+wait+for+all+of+them+together.%0AadviseThreeTimes%28%29%3B%0A%0Aasync+function+fetchAdvice%28%29+%7B%0A++const+res+%3D+await+fetch%28%27https%3A%2F%2Fapi.adviceslip.com%2Fadvice%27%29%3B%0A++const+%7B%0A++++slip%3A+%7B+advice+%7D%0A++%7D+%3D+await+res.json%28%29%3B%0A++return+advice%3B%0A%7D%0A%0Aasync+function+adviseThreeTimes%28%29+%7B%0A++const+advices+%3D+await+Promise.all%28%5B%0A++++fetchAdvice%28%29%2C%0A++++fetchAdvice%28%29%2C%0A++++fetchAdvice%28%29%0A++%5D%29%3B%0A++console.log%28advices%29%3B%0A%7D&console=open&welcome=false&recoverUnsaved=false&title=Async+functions)

```js
advise();

async function advise() {
  const res = await fetch('https://api.adviceslip.com/advice');
  const {
    slip: { advice }
  } = await res.json();
  console.log(advice);
}

// Bonus: start all the requests first, then wait for all of them together.
adviseThreeTimes();

async function fetchAdvice() {
  const res = await fetch('https://api.adviceslip.com/advice');
  const {
    slip: { advice }
  } = await res.json();
  return advice;
}

async function adviseThreeTimes() {
  const advices = await Promise.all([
    fetchAdvice(),
    fetchAdvice(),
    fetchAdvice()
  ]);
  console.log(advices);
}
```

> **Bonus:** an `async` function **always returns a promise**. Calling
> `advise()` returns a promise which resolves (with `undefined`, since it
> returns nothing) once the advice has been printed. If the caller needs to wait
> for it, it has to `await advise()` in turn.
>
> Writing `await fetchAdvice()` three times in a row would wait for each request
> to finish before starting the next.
> [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
> takes promises that are already running and resolves with all of their
> results, in the same order, once they are all done.

### Errors in asynchronous code

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+This+function+always+fails+half+a+second+after+being+called.%0Afunction+loadData%28%29+%7B%0A++return+new+Promise%28%28resolve%2C+reject%29+%3D%3E+%7B%0A++++setTimeout%28%28%29+%3D%3E+reject%28new+Error%28%27Network+is+down%27%29%29%2C+500%29%3B%0A++%7D%29%3B%0A%7D%0A%0Aasync+function+attempt%28%29+%7B%0A++try+%7B%0A++++%2F%2F+Without+%60await%60%2C+%60data%60+was+the+promise+itself%3A+it+was+printed+as+a%0A++++%2F%2F+pending+promise%2C+and+the+try+block+ended+immediately.+When+the+promise%0A++++%2F%2F+was+rejected+half+a+second+later%2C+nothing+was+waiting+for+it+any+more%2C%0A++++%2F%2F+so+the+error+became+an+unhandled+rejection+instead+of+reaching+the+catch%0A++++%2F%2F+block.%0A++++const+data+%3D+await+loadData%28%29%3B%0A++++console.log%28data%29%3B%0A++%7D+catch+%28err%29+%7B%0A++++console.log%28%27Caught%3A%27%2C+err.message%29%3B+%2F%2F+%22Caught%3A+Network+is+down%22%0A++%7D%0A%7D%0A%0Aattempt%28%29%3B&console=open&welcome=false&recoverUnsaved=false&title=Errors+in+asynchronous+code)

```js
// This function always fails half a second after being called.
function loadData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Network is down')), 500);
  });
}

async function attempt() {
  try {
    // Without `await`, `data` was the promise itself: it was printed as a
    // pending promise, and the try block ended immediately. When the promise
    // was rejected half a second later, nothing was waiting for it any more,
    // so the error became an unhandled rejection instead of reaching the catch
    // block.
    const data = await loadData();
    console.log(data);
  } catch (err) {
    console.log('Caught:', err.message); // "Caught: Network is down"
  }
}

attempt();
```

> `await` is what turns a rejected promise into an exception thrown **at that
> line**, which is what a `try...catch` can catch.
