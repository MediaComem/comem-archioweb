const express = require('express');
const fs = require('fs');
const path = require('path');

// The absolute path to the `data/books` directory in this project.
const booksDirectory = path.resolve(path.join(__dirname, '..', 'data', 'books'));

const router = express.Router();

router.get('/books/:id', function(req, res, next) {

  // Make sure the ID is a valid integer, otherwise a malicious user could pass
  // a relative path and potentially access anything on the file system.
  const parsedId = parseInt(req.params.id);
  if (!Number.isInteger(parsedId)) {
    return res.status(400).set('Content-Type', 'text/plain').send('The book ID must be an integer');
  }

  // Attempt to read the JSON file named after the requested ID in the
  // `data/books` directory.
  const bookFile = path.join(booksDirectory, `${parsedId}.json`);
  fs.readFile(bookFile, (err, data) => {
    if (err && err.code === 'ENOENT') {
      // If the file was not found, return a 404 Not Found response.
      return res.sendStatus(404);
    } else if (err) {
      // If another error occurred, return a 500 Internal Server Error response.
      return res.sendStatus(500);
    }

    // Send the raw data as JSON.
    res.set('Content-Type', 'application/json').send(data);
  });
});

module.exports = router;
