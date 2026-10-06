import express from 'express';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const router = express.Router();

// The books directory, relative to this source file (not to the directory the
// application was started from).
const booksDir = new URL('../books/', import.meta.url);

router.get('/', async function (req, res) {
  const files = await readdir(booksDir);
  const bookFiles = files.filter(file => file.endsWith('.json'));

  // Read all the files in parallel.
  const books = await Promise.all(
    bookFiles.map(file => readBook(new URL(file, booksDir)))
  );

  res.json(books);
});

router.get('/:bookId', loadBook, function (req, res) {
  res.json(req.book);
});

router.put('/:bookId', loadBook, async function (req, res) {
  const error = validateBookData(req.body);
  if (error) {
    return res.status(422).json({ message: error });
  }

  const { title, author, publication } = req.body;

  // The ID comes from the URL, never from the body. Only known properties are
  // saved.
  const book = { id: req.book.id, title, author, publication };
  await writeFile(
    bookFileUrl(book.id),
    JSON.stringify(book, undefined, 2) + '\n'
  );

  res.json(book);
});

export default router;

// Middleware that loads the book identified by the URL into req.book, or
// responds with 404 Not Found.
async function loadBook(req, res, next) {
  const bookId = req.params.bookId;

  // Never use an invalid ID in a file path: an ID like "..%2Fpackage" would
  // let anyone read or overwrite other files.
  if (!/^[a-z0-9]+$/.test(bookId)) {
    return bookNotFound(res, bookId);
  }

  try {
    req.book = await readBook(bookFileUrl(bookId));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return bookNotFound(res, bookId);
    }

    // Let the global error handler deal with unexpected errors.
    throw err;
  }

  next();
}

async function readBook(fileUrl) {
  const contents = await readFile(fileUrl, 'utf8');
  return JSON.parse(contents);
}

function bookFileUrl(bookId) {
  return new URL(`${bookId}.json`, booksDir);
}

function bookNotFound(res, bookId) {
  res.status(404).json({ message: `No book found with ID ${bookId}.` });
}

// Return an error message if the data is not a valid book, or undefined.
function validateBookData(data) {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return 'The request body must be a JSON object.';
  } else if (!isNonEmptyString(data.title)) {
    return 'The title must be a non-empty string.';
  } else if (!isNonEmptyString(data.author)) {
    return 'The author must be a non-empty string.';
  } else if (!Number.isInteger(data.publication) || data.publication < -4000) {
    return 'The publication year must be an integer greater than or equal to -4000.';
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.length > 0;
}
