import express from 'express';
const router = express.Router();

router.post('/', function (req, res, next) {
  if (
    !req.body ||
    !Array.isArray(req.body.numbers) ||
    req.body.numbers.some(n => !Number.isFinite(n))
  ) {
    return res
      .status(422)
      .type('text')
      .send('The request body must contain a list of numbers.');
  }

  const numbers = req.body.numbers;

  const n = numbers.length;
  const total = numbers.reduce((memo, n) => memo + n, 0);
  const average = total === 0 ? 0 : total / n;

  res.send({
    average,
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
