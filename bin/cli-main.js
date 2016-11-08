#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const report = require('../lib/main');

const JsonErrRegex = /^Unexpected token .* in JSON/;
const fileExtRegex = /\.[^.]*?$/;
const ERRORS = {
  NO_FILE: 'You must supply a mochawesome data file to create a report.',
  BAD_JSON: 'There was a problem parsing mochawesome data. Please ensure the JSON file is valid.'
};

/**
 * Validate the data file
 *
 */
function validateInFile(dataInFile) {
  let dataIn;
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

  return dataIn;
}

/**
 * Get options to send to report generator
 *
 */
function getOptions(args) {
  const { reportFilename, reportDir, reportTitle, reportPageTitle,
    inlineAssets, enableCharts, enableCode } = args;
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

/**
 * Main CLI Program
 *
 */
function mareport(processArgs) {
  const args = processArgs || { _: [] };
  // Check that a valid data file was provided
  const reportData = validateInFile(args._[0]);

  console.log(args);
  console.log(reportData);
  if (reportData) {
    generateReport(reportData, getOptions(args));
  }
}

module.exports = mareport;
