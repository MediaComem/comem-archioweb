import express from 'express';
const router = express.Router();

router.get('/', function (req, res, next) {
  const name = req.query.name ?? 'World';
  res.send(`Hello, ${name}!`);
});

export default router;
