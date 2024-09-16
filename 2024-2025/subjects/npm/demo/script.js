const lodash = require('lodash');

let numbers = [ 1, 1, 2, 3, 2 ];
console.log(lodash.uniq(numbers)); // [ 1, 2, 3 ]
