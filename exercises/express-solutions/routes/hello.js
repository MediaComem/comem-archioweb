import express from 'express';
const router = express.Router();

router.get('/', function (req, res, next) {
  const name = req.query.name ?? 'World';
  res.set('Content-Type', 'plain/text').send(`Hello, ${name}!`);
});

export default router;
