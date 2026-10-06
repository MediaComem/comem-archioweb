import express from 'express';

const router = express.Router();

router.post('/', function (req, res) {
  // req.body is undefined if the request has no JSON body.
  const numbers = req.body?.numbers;
  if (
    !Array.isArray(numbers) ||
    numbers.length === 0 ||
    !numbers.every(Number.isFinite)
  ) {
    return res
      .status(422)
      .json({
        message: 'The request body must contain a non-empty list of numbers.'
      });
  }

  const total = numbers.reduce((memo, n) => memo + n, 0);
  const average = total / numbers.length;

  res.json({ average, total });
});

export default router;
