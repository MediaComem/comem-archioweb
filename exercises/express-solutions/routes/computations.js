import express from 'express';
const router = express.Router();

router.post('/', function (req, res, next) {
  const numbers = req.body.numbers;

  const n = numbers.length;
  const total = numbers.reduce((memo, n) => memo + n, 0);
  const average = total === 0 ? 0 : total / n;
  const median = computeMedian(numbers);

  res.send({
    average,
    median,
    total
  });
});

export default router;

function computeMedian(numbers) {
  const n = numbers.length;
  if (n === 0) {
    return 0;
  }

  const middle = Math.floor(n / 2);
  if (n % 2 == 1) {
    return numbers[middle];
  }

  return (numbers[middle - 1] + numbers[middle]) / 2;
}
