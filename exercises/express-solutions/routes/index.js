import express from 'express';
const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('Express exercise solutions');
});

export default router;
