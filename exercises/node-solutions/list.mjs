import { readdir } from 'fs/promises';

try {
  const files = await readdir('./');
  const nonHiddenFiles = files.filter(file => !file.startsWith('.'));
  console.log(nonHiddenFiles);
} catch (err) {
  console.error(err);
}
