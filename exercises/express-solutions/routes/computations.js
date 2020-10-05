const express = require('express');

const router = express.Router();

router.post('/computations', function(req, res, next) {

  const numbers = req.body.numbers;
  const total = numbers.reduce((memo, n) => memo + n, 0);
  const average = total / numbers.length;

  res.send({
    average,
    total,
    median: computeMedian(numbers),
  });
});

module.exports = router;

function computeMedian(numbers) {

  // Sort the numbers.
  const sortedNumbers = numbers.slice().sort((a, b) => a - b);

  // If there is an odd number of elements, the middle number is the median.
  if (sortedNumbers.length % 2 === 1) {
    return sortedNumbers[Math.floor(sortedNumbers.length / 2)];
  }

  // Otherwise, the median is the average between the two numbers in the middle.
  const indexRightOfMiddle = sortedNumbers.length / 2;
  const indexLeftOfMiddle = indexRightOfMiddle - 1
  return (sortedNumbers[indexLeftOfMiddle] + sortedNumbers[indexRightOfMiddle]) / 2;
}
