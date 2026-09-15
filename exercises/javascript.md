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

> All these exercises are plain JavaScript. Each one has an **Open in
> LiveCodes** link which opens the code in an online editor: no account is
> needed, and you can edit it and re-run it as often as you want. You can also
> run these exercises in your browser's developer console, or in any other
> JavaScript environment.

## Functions

### Functions as arguments

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+Let%27s+define+a+couple+of+arithmetic+function.%0Afunction+add%28a%2C+b%29+%7B%0A++return+a+%2B+b%3B%0A%7D%0Afunction+multiply%28a%2C+b%29+%7B%0A++return+a+*+b%3B%0A%7D%0A%0A%2F%2F+Define+a+function+that+takes+two+numbers%0A%2F%2F+and+a+function+to+apply+to+those+numbers.%0Afunction+compute%28%2F*+TODO%3A+give+me+some+arguments%21+*%2F%29+%7B%0A++%2F%2F+TODO%3A+implement+me%21%0A%7D%0A%0A%2F%2F+Call+compute+with+%22add%22.%0Alet+value+%3D+compute%282%2C+4%2C+add%29%3B%0Aconsole.log%28value%29%3B+%2F%2F+6%0A%0A%2F%2F+Call+compute+with+%22multiply%22.%0Avalue+%3D+compute%282%2C+4%2C+multiply%29%3B%0Aconsole.log%28value%29%3B+%2F%2F+8&console=open&welcome=false&recoverUnsaved=false&title=Functions+as+arguments)

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

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+Implement+this+function+in+a+way+that+makes+the+rest+of+the+code+work.%0Afunction+createMultiplier%28%2F*+TODO%3A+give+me+some+arguments%21+*%2F%29+%7B%0A++%2F%2F+TODO%3A+implement+me%21%0A%7D%0A%0Aconst+multiplyByTwo+%3D+createMultiplier%282%29%3B%0Aconsole.log%28multiplyByTwo%281%29%29%3B+%2F%2F+2%0Aconsole.log%28multiplyByTwo%282%29%29%3B+%2F%2F+4%0Aconsole.log%28multiplyByTwo%283%29%29%3B+%2F%2F+6%0A%0Aconst+multiplyByFive+%3D+createMultiplier%285%29%3B%0Aconsole.log%28multiplyByFive%281%29%29%3B+%2F%2F+5%0Aconsole.log%28multiplyByFive%282%29%29%3B+%2F%2F+10%0Aconsole.log%28multiplyByFive%283%29%29%3B+%2F%2F+15&console=open&welcome=false&recoverUnsaved=false&title=Dynamically+create+functions)

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

[Open in LiveCodes](https://livecodes.io/?js=function+sayHello%28%29+%7B%0A++console.log%28%27Hello%21%27%29%3B%0A%7D%0A%0A%2F%2F+This+prints+%22Hello%21%22+immediately+instead+of+one+second+later%2C%0A%2F%2F+and+it+prints+it+only+once+even+if+you+wait.+Why%3F%0AsetTimeout%28sayHello%28%29%2C+1000%29%3B%0A%0A%2F%2F+TODO%3A+fix+the+line+above+so+that+%22Hello%21%22+is+printed+once%2C+after+one+second.&console=open&welcome=false&recoverUnsaved=false&title=Passing+a+function+vs+calling+it)

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

[Open in LiveCodes](https://livecodes.io/?js=const+counter+%3D+%7B%0A++count%3A+0%2C%0A%0A++%2F%2F+This+method+is+supposed+to+increment+the+counter%2C+but+it+doesn%27t.%0A++increment%3A+%28%29+%3D%3E+%7B%0A++++this.count%2B%2B%3B%0A++%7D%0A%7D%3B%0A%0Acounter.increment%28%29%3B%0Acounter.increment%28%29%3B%0A%0Aconsole.log%28counter.count%29%3B+%2F%2F+should+be+2&console=open&welcome=false&recoverUnsaved=false&title=The+this+keyword)

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

[Open in LiveCodes](https://livecodes.io/?js=const+original+%3D+%7B+name%3A+%27Alice%27%2C+tags%3A+%5B%27admin%27%5D+%7D%3B%0Aconst+copy+%3D+original%3B%0A%0Acopy.name+%3D+%27Bob%27%3B%0Acopy.tags.push%28%27editor%27%29%3B%0A%0A%2F%2F+1.+What+do+these+two+lines+print%3F+Why+is+this+allowed+even+though%0A%2F%2F++++%60original%60+and+%60copy%60+are+both+declared+with+%60const%60%3F%0Aconsole.log%28original.name%29%3B%0Aconsole.log%28original.tags%29%3B%0A%0A%2F%2F+2.+TODO%3A+edit+the+code+above+to+make+%60copy%60+an+actual+copy%2C+so+that+the+first%0A%2F%2F++++of+the+two+lines+above+prints+%22Alice%22+again.&console=open&welcome=false&recoverUnsaved=false&title=Value+or+reference%3F)

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

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+1.+Predict+the+value+of+each+of+these+expressions%2C+then+check.%0Aconsole.log%281+%3D%3D+%271%27%29%3B%0Aconsole.log%281+%3D%3D%3D+%271%27%29%3B%0Aconsole.log%28null+%3D%3D+undefined%29%3B%0Aconsole.log%28null+%3D%3D%3D+undefined%29%3B%0Aconsole.log%28%5B%5D+%3D%3D+false%29%3B%0A%0A%2F%2F+2.+This+function+should+return+true+whenever+a+value+has+been+provided%2C+and%0A%2F%2F++++false+only+when+there+is+no+value+at+all.+It+gets+two+of+these+five+cases%0A%2F%2F++++wrong.+Which+ones%3F+TODO%3A+fix+it.%0Afunction+hasValue%28value%29+%7B%0A++return+value+%3F+true+%3A+false%3B%0A%7D%0A%0Aconsole.log%28hasValue%28%27hello%27%29%29%3B%0Aconsole.log%28hasValue%280%29%29%3B%0Aconsole.log%28hasValue%28%27%27%29%29%3B%0Aconsole.log%28hasValue%28null%29%29%3B%0Aconsole.log%28hasValue%28undefined%29%29%3B&console=open&welcome=false&recoverUnsaved=false&title=Equality+and+falsiness)

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

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+Values+that+come+from+outside+your+program+%28a+form+field%2C+a+URL%2C+a+text%0A%2F%2F+file...%29+are+strings%2C+even+when+they+look+like+numbers.%0Aconst+input+%3D+%2710%27%3B%0A%0A%2F%2F+1.+Predict+what+these+two+lines+print.+Why+are+they+different%3F%0Aconsole.log%28input+%2B+1%29%3B%0Aconsole.log%28input+*+2%29%3B%0A%0A%2F%2F+2.+TODO%3A+fix+this+function+so+that+it+works+with+both+%2710%27+and+10.%0Afunction+addTen%28value%29+%7B%0A++return+value+%2B+10%3B%0A%7D%0A%0Aconsole.log%28addTen%28%2710%27%29%29%3B+%2F%2F+should+be+20%0Aconsole.log%28addTen%2810%29%29%3B+%2F%2F+should+be+20&console=open&welcome=false&recoverUnsaved=false&title=Strings+and+numbers)

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

[Open in LiveCodes](https://livecodes.io/?js=const+movies+%3D+%5B%0A++%7B+title%3A+%27The+Matrix%27%2C+year%3A+1999%2C+rating%3A+8.7+%7D%2C%0A++%7B+title%3A+%27Inception%27%2C+year%3A+2010%2C+rating%3A+8.8+%7D%2C%0A++%7B+title%3A+%27Tenet%27%2C+year%3A+2020%2C+rating%3A+7.3+%7D%2C%0A++%7B+title%3A+%27Memento%27%2C+year%3A+2000%2C+rating%3A+8.4+%7D%0A%5D%3B%0A%0A%2F%2F+Produce+each+of+these+WITHOUT+writing+a+single+%60for%60+loop.%0A%0A%2F%2F+1.+The+list+of+titles%3A%0A%2F%2F++++%5B+%22The+Matrix%22%2C+%22Inception%22%2C+%22Tenet%22%2C+%22Memento%22+%5D%0A%0A%2F%2F+2.+Only+the+movies+rated+above+8.5.%0A%0A%2F%2F+3.+The+average+rating+of+all+the+movies.&console=open&welcome=false&recoverUnsaved=false&title=Transforming+arrays)

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

[Open in LiveCodes](https://livecodes.io/?js=const+values+%3D+%5B10%2C+9%2C+100%2C+1%5D%3B%0A%0A%2F%2F+1.+This+does+not+print+%5B+1%2C+9%2C+10%2C+100+%5D.+What+does+it+print%2C+and+why%3F%0Aconsole.log%28values.sort%28%29%29%3B%0A%0A%2F%2F+2.+TODO%3A+sort+the+values+in+ascending+numerical+order.%0A%0A%2F%2F+3.+What+is+in+%60values%60+after+sorting%3F+Was+the+original+array+left+untouched%3F%0A%0A%2F%2F+4.+TODO%3A+sort+these+movies+by+year%2C+most+recent+first.%0Aconst+movies+%3D+%5B%0A++%7B+title%3A+%27The+Matrix%27%2C+year%3A+1999+%7D%2C%0A++%7B+title%3A+%27Inception%27%2C+year%3A+2010+%7D%2C%0A++%7B+title%3A+%27Memento%27%2C+year%3A+2000+%7D%0A%5D%3B&console=open&welcome=false&recoverUnsaved=false&title=Sorting)

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

[Open in LiveCodes](https://livecodes.io/?js=const+options+%3D+%7B+color%3A+%27red%27%2C+size%3A+42+%7D%3B%0A%0A%2F%2F+1.+TODO%3A+replace+these+3+lines+with+a+single+destructuring+assignment%2C%0A%2F%2F++++keeping+the+same+behaviour+%28including+the+default+shape%29.%0Aconst+color+%3D+options.color%3B%0Aconst+size+%3D+options.size%3B%0Aconst+shape+%3D+options.shape+%21%3D%3D+undefined+%3F+options.shape+%3A+%27circle%27%3B%0A%0Aconsole.log%28%60A+%24%7Bsize%7Dpx+%24%7Bcolor%7D+%24%7Bshape%7D%60%29%3B+%2F%2F+%22A+42px+red+circle%22%0A%0A%2F%2F+2.+TODO%3A+use+a+destructuring+assignment+to+get+the+first+value+and+an+array%0A%2F%2F++++of+all+the+others%2C+without+modifying+the+last+2+lines.%0Aconst+values+%3D+%5B23%2C+61%2C+42%2C+51%2C+12%5D%3B%0A%0Aconsole.log%28%60The+first+value+is+%24%7BfirstValue%7D%60%29%3B%0Aconsole.log%28%60The+other+values+are+%24%7BotherValues.join%28%27%2C+%27%29%7D%60%29%3B&console=open&welcome=false&recoverUnsaved=false&title=Destructuring)

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

[Open in LiveCodes](https://livecodes.io/?js=const+defaults+%3D+%7B+color%3A+%27black%27%2C+size%3A+10%2C+shape%3A+%27circle%27+%7D%3B%0Aconst+custom+%3D+%7B+color%3A+%27red%27+%7D%3B%0A%0A%2F%2F+1.+TODO%3A+build+an+%60options%60+object+with+all+the+default+values%2C+with+the%0A%2F%2F++++custom+values+applied+on+top.+Modify+neither+%60defaults%60+nor+%60custom%60.%0Aconst+options+%3D+%7B%7D%3B+%2F%2F+TODO%3A+fix+me%21%0A%0Aconsole.log%28options%29%3B+%2F%2F+%7B+color%3A+%22red%22%2C+size%3A+10%2C+shape%3A+%22circle%22+%7D%0A%0A%2F%2F+2.+TODO%3A+implement+this+function+so+that+it+accepts+any+number+of+arguments.%0Afunction+sum%28%2F*+TODO%3A+give+me+some+arguments%21+*%2F%29+%7B%0A++%2F%2F+TODO%3A+implement+me%21%0A%7D%0A%0Aconsole.log%28sum%281%2C+2%29%29%3B+%2F%2F+3%0Aconsole.log%28sum%281%2C+2%2C+3%2C+4%29%29%3B+%2F%2F+10&console=open&welcome=false&recoverUnsaved=false&title=Spread+and+rest)

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

[Open in LiveCodes](https://livecodes.io/?js=const+bob+%3D+%7B+name%3A+%27Bob%27%2C+address%3A+null+%7D%3B%0Aconst+alice+%3D+%7B+name%3A+%27Alice%27%2C+address%3A+%7B+poBox%3A+%27000%27+%7D+%7D%3B%0Aconst+chuck+%3D+%7B+name%3A+%27Chuck%27%2C+address%3A+%7B+city%3A+%27Dallas%27+%7D+%7D%3B%0A%0A%2F%2F+TODO%3A+simplify+this+function+down+to+a+single+line%2C+using+optional+chaining%0A%2F%2F+and+the+nullish+coalescing+operator.%0Afunction+whereDoTheyLive%28person%29+%7B%0A++if+%28%21person%29+%7B%0A++++return+%27Unknown%27%3B%0A++%7D%0A%0A++const+address+%3D+person.address%3B%0A++if+%28%21address%29+%7B%0A++++return+%27Unknown%27%3B%0A++%7D%0A%0A++const+city+%3D+address.city%3B%0A++if+%28%21city%29+%7B%0A++++return+%27Unknown%27%3B%0A++%7D%0A%0A++return+city%3B%0A%7D%0A%0Aconsole.log%28whereDoTheyLive%28bob%29%29%3B+%2F%2F+%22Unknown%22%0Aconsole.log%28whereDoTheyLive%28alice%29%29%3B+%2F%2F+%22Unknown%22%0Aconsole.log%28whereDoTheyLive%28chuck%29%29%3B+%2F%2F+%22Dallas%22&console=open&welcome=false&recoverUnsaved=false&title=Optional+chaining+and+the+nullish+coalescing+operator)

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

[Open in LiveCodes](https://livecodes.io/?js=const+ratings+%3D+%7B+matrix%3A+8.7%2C+inception%3A+8.8%2C+tenet%3A+7.3+%7D%3B%0A%0A%2F%2F+1.+This+throws+an+error.+Why%3F%0Aratings.forEach%28rating+%3D%3E+console.log%28rating%29%29%3B%0A%0A%2F%2F+2.+TODO%3A+print+each+key+with+its+value%2C+e.g.+%22matrix%3A+8.7%22.%0A%0A%2F%2F+3.+TODO%3A+build+an+array+of+all+the+keys%2C+then+an+array+of+all+the+values.%0A%0A%2F%2F+4.+TODO%3A+compute+the+average+rating.%0A%0A%2F%2F+5.+TODO%3A+check+whether+%60ratings%60+has+an+entry+for+%22memento%22.&console=open&welcome=false&recoverUnsaved=false&title=Objects+are+not+arrays)

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

[Open in LiveCodes](https://livecodes.io/?js=const+personJson+%3D+%27%7B%22first%22%3A%22James%22%2C%22last%22%3A%22Bond%22%7D%27%3B%0A%0A%2F%2F+1.+TODO%3A+extract+the+person%27s+first+and+last+names+to+new+variables%0A%2F%2F++++to+make+this+code+work%2C+without+modifying+the+rest+of+the+code.%0A%0Aconsole.log%28%60My+name+is+%24%7Blast%7D%2C+%24%7Bfirst%7D+%24%7Blast%7D%60%29%3B%0A%0A%2F%2F+2.+TODO%3A+turn+this+object+into+a+JSON+string.%0Aconst+person+%3D+%7B+first%3A+%27James%27%2C+last%3A+%27Bond%27%2C+licensed%3A+true+%7D%3B&console=open&welcome=false&recoverUnsaved=false&title=JSON)

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

[Open in LiveCodes](https://livecodes.io/?js=advise%28%29%3B%0A%0A%2F%2F+TODO%3A+get+rid+of+the+.then+calls+and+callback+functions+by+using+async%2Fawait.%0Afunction+advise%28%29+%7B%0A++fetch%28%27https%3A%2F%2Fapi.adviceslip.com%2Fadvice%27%29%0A++++.then%28res+%3D%3E+res.json%28%29%29%0A++++.then%28%28%7B+slip%3A+%7B+advice+%7D+%7D%29+%3D%3E+console.log%28advice%29%29%3B%0A%7D&console=open&welcome=false&recoverUnsaved=false&title=Async+functions)

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

[Open in LiveCodes](https://livecodes.io/?js=%2F%2F+This+function+always+fails+half+a+second+after+being+called.%0Afunction+loadData%28%29+%7B%0A++return+new+Promise%28%28resolve%2C+reject%29+%3D%3E+%7B%0A++++setTimeout%28%28%29+%3D%3E+reject%28new+Error%28%27Network+is+down%27%29%29%2C+500%29%3B%0A++%7D%29%3B%0A%7D%0A%0A%2F%2F+This+is+supposed+to+print+%22Caught%3A+Network+is+down%22%2C+but+it+prints+something%0A%2F%2F+surprising+and+never+reaches+the+catch+block.%0A%2F%2F+Why%3F+TODO%3A+fix+it.%0Aasync+function+attempt%28%29+%7B%0A++try+%7B%0A++++const+data+%3D+loadData%28%29%3B%0A++++console.log%28data%29%3B%0A++%7D+catch+%28err%29+%7B%0A++++console.log%28%27Caught%3A%27%2C+err.message%29%3B%0A++%7D%0A%7D%0A%0Aattempt%28%29%3B&console=open&welcome=false&recoverUnsaved=false&title=Errors+in+asynchronous+code)

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
