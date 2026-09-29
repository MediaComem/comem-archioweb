import fs from 'node:fs/promises';

// Check the arguments.
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: node yell.mjs <file>');
  process.exit(1);
}

// Get the file name from the first argument.
const [filename] = args;

try {
  // Read the contents of the file.
  const data = await fs.readFile(filename, 'utf-8');
  // Print the contents in uppercase.
  console.log(data.toUpperCase());
} catch (err) {
  // Bonus: print a readable message instead of a stack trace.
  console.error(`Could not read ${filename}: ${err.message}`);
  process.exitCode = 1;
}
