import uniq from 'lodash/uniq.js';

// The first two elements of process.argv are the paths to node and the script.
const args = process.argv.slice(2);

for (const value of uniq(args)) {
  console.log(value);
}
