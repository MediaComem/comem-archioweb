import fs from 'fs/promises';

// Check the arguments.
if (process.argv.length <= 2) {
  throw new Error('A file name must be provided as the first argument');
} else if (process.argv.length >= 4) {
  throw new Error('This script only supports one file name argument');
}

// Get the file name from the first argument.
const filename = process.argv[2];

try {
  // Read the contents of the file.
  const data = await fs.readFile(filename, 'utf-8');
  // Print the contents in uppercase.
  console.log(data.toUpperCase());
} catch (err) {
  console.warn(`Could not read file because: ${err.message}`);
}
