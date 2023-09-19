# Node.js exercises

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Show the current time](#show-the-current-time)
- [List the current directory](#list-the-current-directory)
- [Calculator](#calculator)
- [Notoriously psychedelic modules](#notoriously-psychedelic-modules)
- [Yell](#yell)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Show the current time

Write a `now.mjs` script that prints the current date and time to your console
when executed:

```bash
$> node now.mjs
Tue Sep 15 2022 11:00:31 GMT+0200 (Central European Summer Time)
```



## List the current directory

Write a `list.mjs` script that lists the contents of the directory where it is
executed. Here's how the output could look like, but of course it will depend on
what files are on your machine and which directory you list:

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

Write a `unique.mjs` script which takes any number of arguments and prints each
unique argument on one line.

Use the [Lodash](https://lodash.com) library to accomplish this. The goal of
this exercise is to install and use a third-party library that is not provided
out of the box with Node.js, using the npm package manager.

The resulting script should behave like this:

```bash
$> node unique.mjs 1 2 4 3 2 3 5 6 4 4
1
2
4
3
5
6

$> node unique.mjs Hello Bob Hello Alice
Hello
Bob
Alice
```

> You could of course implement the detection of unique values yourself, but
> that is not the purpose of this particular exercise.

To complete this exercise:

* Install Lodash.
* Find the appropriate Lodash function.
* Write your script.

You may find the following documentation useful:

* [Lodash](https://lodash.com)
* [Lodash's documentation](https://lodash.com/docs/4.17.15)
* [`process.argv`](https://nodejs.org/api/process.html#process_process_argv)
* [Theory on npm](https://mediacomem.github.io/comem-archioweb/2023-2024/subjects/npm/?home=MediaComem%2Fcomem-archioweb%23readme#1)



## Yell

Create a Node.js command line script named `yell.mjs` which:

* Takes one file name as an argument.
* Reads the file with the UTF-8 encoding.
* Converts the contents of the file to uppercase.
* Outputs the converted contents.

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

You may find the following documentation useful:

* [`process.argv`](https://nodejs.org/api/process.html#process_process_argv)
* [`fs.readFile`](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)
* [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
