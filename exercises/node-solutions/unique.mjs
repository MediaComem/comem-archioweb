import _ from 'lodash';

const args = process.argv.slice(2);
for (const value of _.uniq(args)) {
  console.log(value);
}
