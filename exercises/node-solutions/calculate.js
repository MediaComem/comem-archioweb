const { add, multiply } = require('./calculator/simple.js');
const { pow } = require('./calculator/advanced.js');

console.log(`2 added to 1 is: ${add(1, 2)}`);
console.log(`2 multiplied by 3 is: ${multiply(2, 3)}`);
console.log(`2 to the power of 10 is: ${pow(2, 10)}`);
