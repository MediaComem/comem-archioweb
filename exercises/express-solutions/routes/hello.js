const express = require('express');

const router = express.Router();

// GET /hello{?name}
router.get('/', function(req, res, next) {
  const name = req.query.name || 'World';
  const salutation = `Hello ${name}!`;
  res.set('Content-Type', 'text/plain').send(salutation);
});

module.exports = router;