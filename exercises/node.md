# Node.js exercises

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Calculator](#calculator)
- [Yell](#yell)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



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
