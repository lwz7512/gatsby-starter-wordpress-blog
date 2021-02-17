/**
 * this script auto run after npm install or yarn
 * 
 * temporary solution for issue #29535:
 * https://github.com/gatsbyjs/gatsby/issues/29535
 * 
 * replace the buggy line with new working line in:
 * node_modules/gatsby-source-wordpress/dist/steps/create-schema-customization/build-types.js
 *
 * from:
 * if (!Object.keys(transformedFields).length) {
 *   return;
 * }
 * 
 * to:
 * if (!transformedFields || !Object.keys(transformedFields).length) {
 *   return;
 * }
 * 
 */
const path = require('path');
const readline = require('readline');
const fs = require('fs');
const lines = [];

const bugFile = path.join(
  'node_modules', 'gatsby-source-wordpress', 'dist', 'steps', 'create-schema-customization', 'build-types.js'
);

const readInterface = readline.createInterface({
  input: fs.createReadStream(bugFile),
  console: false
});

readInterface.on('line', function(line) {
  let count = (line.match(/transformedFields/g) || []).length;
  if (line.includes('Object.keys') && count == 1) {
    console.log('>>>> got the buggy line!');
    line = '  if (!transformedFields || !Object.keys(transformedFields).length) {';
  }
  lines.push(line)
});

readInterface.on('close', function() {
  let writeStream = fs.createWriteStream(bugFile);
  lines.forEach(line => writeStream.write(line+'\n'));
  writeStream.end();
  console.log('<<<<< completed the patch!')
});

console.log('>>>>> starting to fix gatsby-source-wordpress v4.0.1 bug ...');
