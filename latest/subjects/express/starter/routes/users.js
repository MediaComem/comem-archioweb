import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
  res.send('Got a response from the users route');
});

export default router;
