/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Mocha = require('mocha');

// Instantiate a Mocha instance with mochawesome reporter
const mocha = new Mocha({
  reporter: '../mochawesome', // path relative to cwd
  reporterOptions: {
    dev: true,
    overwrite: true,
    showPassed: false
  }
});

const testCasesDir = path.join(__dirname, 'cases');
const args = Array.prototype.slice.call(process.argv, 2);

const isJSFile = file => file.substr(-3) === '.js';

const testPaths = args.length ? args : [ testCasesDir ];

const addDirectoryToMocha = dir => {
  fs.readdirSync(dir)
    .filter(isJSFile)
    .forEach(file => {
      mocha.addFile(path.join(dir, file));
    });
};

const addFileToMocha = file => mocha.addFile(path.resolve(process.cwd(), file));

testPaths.forEach(testPath => {
  let stats;
  try {
    stats = fs.statSync(testPath);
  } catch (err) {
    console.error(err.message);
  }

  if (stats && stats.isDirectory()) {
    addDirectoryToMocha(testPath);
  }
  if (stats && stats.isFile() && isJSFile(testPath)) {
    addFileToMocha(testPath);
  }
});

// Run the tests.
if (mocha.files.length) {
  mocha.run(failures => {
    // exit with non-zero status if there were failures
    process.on('exit', () => process.exit(failures));
  });
} else {
  console.log('No valid test files found. Aborting test run.');
}
