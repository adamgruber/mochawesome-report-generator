#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const report = require('../lib/main');
const yargs = require('yargs');

// Setup yargs
yargs
  .usage('Usage: $0 [data-in-file] [options]')
  .options({
    'inline-assets': {
      default: false,
      describe: 'Inline report assets (styles, scripts)',
      boolean: true
    },
    'charts': {
      default: true,
      describe: 'Enable charts',
      boolean: true
    },
    'code': {
      default: true,
      describe: 'Enable displaying of test code',
      boolean: true
    }
  })
  .help('help')
  .alias('h', 'help')
  .epilog('Copyright 2016 Adam Gruber')
  .argv;

const argv = yargs.argv;
const JsonErrRegex = /^Unexpected token .* in JSON/;
const ERRORS = {
  NO_FILE: 'You must supply a mochawesome data file to create a report.',
  BAD_JSON: 'There was a problem parsing the mochawesome data. Please ensure the JSON file is valid.'
};

let dataIn;

/**
 * Validate the data file
 *
 */
 function validateInFile(dataInFile) {
  // Was a JSON file provided?
  if (!dataInFile) {
    console.log(ERRORS.NO_FILE);
    process.exitCode = 1;
    return false;
  }

  // Try to read and parse the file
  try {
    dataIn = JSON.parse(fs.readFileSync(dataInFile, 'utf-8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`The data file: ${dataInFile} could not be found.`);
    } else if (JsonErrRegex.test(err.message)) {
      console.log(ERRORS.BAD_JSON);
    }
    process.exitCode = 1;
    return false;
  }
}

/**
 * Generate the report
 *
 */
function generateReport(dataIn, options) {
  report.createSync(dataIn, {
    dev: true,
    reportHtmlFile: path.join(process.cwd(), 'reportTest.html')
  });
}

// Check that a valid data file was provided
validateInFile(argv._[0]);

console.log(dataIn);
if (dataIn) {
  generateReport(dataIn, {});
}

/* Required Args
 * @argument {string} test-data Data to use for rendering report
 */


/* Report Options
 * @property {boolean} inline-assets     Should assets be inlined into HTML file (default: false)
 * @property {string}  report-title      Title to use on the report (default: mochawesome) 
 * @property {string}  report-page-title Title of the report document (default: mochawesome-report)
 * @property {string}  report-filename   Filename of report (default: mochawesome)
 * @property {string}  report-dir        Directory to save report to (default: cwd/mochawesome-reports)
 * @property {boolean} charts            Should charts be enabled (default: true)
 * @property {boolean} code              Should test code output be enabled (default: true)
 */
