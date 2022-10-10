import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
const router = express.Router();

// Retrieve the directory containing this source file.
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Determine the path to the books directory relative to this source file's
// directory.
const booksDir = path.join(__dirname, '../books');

router.get('/:id', function (req, res, next) {
  // Get and validate the book ID.
  const bookId = parseInt(req.params.id, 10);
  if (!Number.isInteger(bookId)) {
    // Return 404 Not Found if the ID is invalid.
    return res.sendStatus(404);
  }

  fs.readFile(
    path.join(booksDir, `${bookId}.json`),
    'utf8',
    (err, contents) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Return 404 Not Found if the book file cannot be found.
          return res.sendStatus(404);
        }

        // Return 500 Internal Server Error if another unexpected error occurs.
        return res.sendStatus(500);
      }

      res.send(contents);
    }
  );
});

export default router;
