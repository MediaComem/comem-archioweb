import fs from 'node:fs/promises';

// List the directory the script was executed from (not the one it is in).
const files = await fs.readdir(process.cwd());

// Bonus: ignore hidden files.
const visibleFiles = files.filter(file => !file.startsWith('.'));

console.log(visibleFiles.join(' '));
