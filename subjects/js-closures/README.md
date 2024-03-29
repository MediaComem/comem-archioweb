# JavaScript Closures

Learn what's a JavaScript closure, how to use them, and common pitfalls.

**You will need**

* [Google Chrome][chrome] (recommended, any browser with developer tools will do)

**Recommended reading**

* [JavaScript](../js/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [THIS!.. IS!.. CLOSURE!](#this-is-closure)
  - [This is not...](#this-is-not)
- [Closures in loops](#closures-in-loops)
  - [Wait... what?](#wait-what)
  - [Doing it right](#doing-it-right)
  - [The revelation](#the-revelation)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## THIS!.. IS!.. CLOSURE!

Consider this example:

```javascript
function makeYeller() {
  var city = 'Sparta';
* return function yell() {
*   console.log('This is... ' + city);
* };
};

var leonidas = makeYeller(); // Store a new yell() function
leonidas(); // "This is... Sparta"
```

> `yell()` is a **closure**: a function that has a reference to a variable declared in an outer scope (in this cas, the `city` variable).

When created, `yell()` functions will permanently keep the reference to the `city` variable, even after `makeYeller()`'s execution has completed.

Thus, when the `yell()` function is executed on the last line, it will get the latest value of the `city` variable and print it.

<!-- slide-notes -->

> In this example, `yell()` can access `city`, because both the function and the variable are declared **inside the same scope**, that of `makeYeller()`.

If you were to create another instance of `yell()`, say by adding this code:

```javascript
var gerard = makeYeller(); // Store a new yell() function
```

This new instance would also keep a reference to `city` (and print `"Sparta"` when called), but it would be a different `yell()` function than the one stored in the `leonidas` variable.
To be sure of that, do:

```javascript
console.log(gerard === leonidas); // false
```



### This is not...

For illustration purposes, let's rewrite the previous example like this.

```javascript
function makeYeller() {
  var city = "Sparta";
  return yell;
};

function yell() {
  console.log(city);
};

var leonidas = yell() // Stores the yell() function
leonidas(); // ReferenceError: city is not defined
```

The code apparently didn't change that much; all we did was declare `yell()` outside of `makeYeller()`, and yet it's enough to _break everything_.

`city` is still declared in the scope of `makeYeller()`, but since `yell()` is declared **outside** this scope, it **cannot** access `city` anymore, resulting in a `ReferenceError` when executed.

<!-- slide-notes -->

Moreover, in this case, there is only one instance of `yell()`, that is created when the script is first executed.

To test it, let's add the same code as before:

```javascript
var gerard = makeYeller(); // Store a yell() function

console.log(gerard === leonidas) // true
```
Here, `leonidas` and `gerard` store the same `yell()` function.



## Closures in loops

Using closures inside a loop can result in a well-know bug _(and laptops being tossed out of windows, too)_.
Consider the following code:

```javascript
// Returns an array of 10 rank() functions
function createArmy() {
  var generatedSoldiers = []; // Create the array
  for (var nb = 1; nb < 11; nb++) {
    var rank = function() { // Rank function that logs the soldier's number
      console.log("I'm the soldier n°" + nb);
    };
    generatedSoldiers.push(rank); // Store it in the array
  }
  return generatedSoldiers; // Return the array
};

var spartan = createArmy();

// Let's execute all the created functions
spartan.forEach(function(soldierFunc) {
  soldierFunc();
});
```
> What will be the output of this code, [once executed][closure-loop-bug-codepen]?

<!-- slide-notes -->

When we execute all the functions that have been created by the call to `createArmy()`, we could expect the first one to print `"I'm the soldier n°1"`, the second to print `"I'm the soldier n°2"` and so on, until the tenth, that would print `"I'm the soldier n°10"`.

Instead, all the functions will print `"I'm the soldier n°11"`...



### Wait... what?

In the previous example, the function stored in `rank` is a **closure**: it has a reference to a variable declared in an outer scope.

In this case, `rank` has a reference to the `nb` variable (declared by the `for` block).

```javascript
// ...
*for (var nb = 1; nb < 11; nb++) {
  var rank = function() {
*   console.log("I'm the soldier n°" + nb);
  };
  // ...
}
// ...
```

Each of the 10 `rank` functions will forever keep a **reference** to the `nb` variable... but not to its **value at the time of the function's creation!**

The `rank` functions will only retrieve the value of `nb` when they are executed: that is **after** the `for` loop is finished.

> And at that time, `nb` will have a value of `11`.



### Doing it right

To solve this problem, we have to find a way to capture not a *reference* to `nb`, but **its value at the time each function is created**. Here is the correct code:

```javascript
*function makeRank(nbValue) { // Rank function factory
* return function rank() {
*   console.log("I'm the soldier n°" + nbValue);
* };
*}

// Returns an array of 10 rank() functions
function createArmy() {
  var generatedSoldiers = [];
  for (var nb = 1; nb < 11; nb++) {
*   generatedSoldiers.push(makeRank(nb));
  }
  return generatedSoldiers;
};

var spartan = createArmy();
spartan.forEach(function( soldierFunc ) {
  soldierFunc();
});
```

> The `rank()` function is still a **closure**, but it now references the `nbValue` variable, declared in the signature of `makeRank()`.

### The revelation

We have introduced a **factory function**, `makeRank()`, which returns a new `rank()` function when called:

```javascript
function makeRank(nbValue) {
  return function rank() {
    console.log("I'm the soldier n°" + nbValue);
  };
}
```

The `nbValue` argument is a **local variable** that `rank()` can access.

Each time the `for` loop calls `makeRank()`, the **current value** of `nb` is passed:

```javascript
for (var nb = 1; nb < 11; nb++) {
* generatedSoldiers.push(makeRank(nb));
}
```

When you pass a primitive value to a function in JavaScript, its **value** is passed, *not a reference* to the variable.

So each `rank()` function will keep a reference to its own `nbValue` variable, which had a different value at every iteration of the `for` loop.



## References

**Documentation**

* [MDN - Closures][closure]



[chrome]: https://www.google.com/chrome/
[closure]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
[closure-loop-bug-codepen]: http://codepen.io/AlphaHydrae/pen/gmYQpN?editors=0010#0
