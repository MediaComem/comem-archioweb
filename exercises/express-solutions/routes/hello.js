import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
  const name = req.query.name ?? 'World';
  res.json({ greeting: `Hello, ${name}!` });
});

export default router;
