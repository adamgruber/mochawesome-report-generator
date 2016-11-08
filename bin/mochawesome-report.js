#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const report = require('../lib/main');
const yargs = require('yargs');

/* Report Options
 * @property {string}  reportFilename   Filename of report (default: mochawesome)
 * @property {string}  reportDir        Path to save report to (default: cwd/mochawesome-reports)
 * @property {string}  reportTitle      Title to use on the report (default: mochawesome)
 * @property {string}  reportPageTitle  Title of the report document (default: mochawesome-report)
 * @property {boolean} inlineAssets     Should assets be inlined into HTML file (default: false)
 * @property {boolean} charts           Should charts be enabled (default: true)
 * @property {boolean} code             Should test code output be enabled (default: true)
 */

// Setup yargs
yargs
  .usage('Usage: $0 [data-in-file] [options]')
  .options({
    f: {
      alias: [ 'reportFilename' ],
      default: 'mochawesome',
      describe: 'Filename of saved report',
      string: true,
      requiresArg: true
    },
    o: {
      alias: [ 'reportDir' ],
      default: path.join(process.cwd(), 'mochawesome-report'),
      describe: 'Path to save report',
      string: true,
      normalize: true,
      requiresArg: true
    },
    t: {
      alias: [ 'reportTitle' ],
      default: 'mochawesome',
      describe: 'Report title',
      string: true,
      requiresArg: true
    },
    p: {
      alias: [ 'reportPageTitle' ],
      default: 'mochawesome-report',
      describe: 'Browser title',
      string: true,
      requiresArg: true
    },
    i: {
      alias: [ 'inline', 'inlineAssets' ],
      default: false,
      describe: 'Inline report assets (styles, scripts)',
      boolean: true
    },
    charts: {
      alias: [ 'enableCharts' ],
      default: true,
      describe: 'Display charts',
      boolean: true
    },
    code: {
      alias: [ 'enableCode' ],
      default: true,
      describe: 'Display test code',
      boolean: true
    }
  })
  .help('help')
  .alias('h', 'help')
  .epilog('Copyright 2016 Adam Gruber')
  .argv;

const argv = yargs.argv;
const JsonErrRegex = /^Unexpected token .* in JSON/;
const fileExtRegex = /\.[^.]*?$/;
const ERRORS = {
  NO_FILE: 'You must supply a mochawesome data file to create a report.',
  BAD_JSON: 'There was a problem parsing mochawesome data. Please ensure the JSON file is valid.'
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

  return true;
}

/**
 * Get options to send to report generator
 *
 */
function getOptions() {
  const { reportFilename, reportDir, reportTitle, reportPageTitle,
    inlineAssets, enableCharts, enableCode } = argv;
  const filename = `${reportFilename.replace(fileExtRegex, '')}.html`;
  return {
    reportHtmlFile: path.join(reportDir, filename),
    reportTitle,
    reportPageTitle,
    inlineAssets,
    enableCharts,
    enableCode
  };
}

/**
 * Generate the report
 *
 */
function generateReport(data, options) {
  console.log(options);
  options.dev = true;
  report.createSync(data, options);
}

// Check that a valid data file was provided
validateInFile(argv._[0]);

console.log(argv);
console.log(dataIn);
if (dataIn) {
  generateReport(dataIn, getOptions());
}

/* Required Args
 * @argument {string} test-data Data to use for rendering report
 */
