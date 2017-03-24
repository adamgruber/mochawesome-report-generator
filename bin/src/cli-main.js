/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const t = require('tcomb-validation');
const report = require('../lib/main');
const types = require('./types');

const JsonErrRegex = /^Unexpected token .* in JSON/;
const fileExtRegex = /\.[^.]*?$/;
const ERRORS = {
  NO_FILE: 'You must supply a mochawesome data file to create a report.',
  NOT_FOUND: filename => `The data file: ${filename} could not be found.`,
  BAD_JSON: 'There was a problem parsing mochawesome data. Please ensure the JSON file is valid.',
  GENERIC: 'There was a problem loading mochawesome data.',
  INVALID_JSON: errMsg => `There was a problem parsing mochawesome data:\n${errMsg}`
};

/**
 * Validate the data file
 *
 * @param {string} dataInFile Filename of test data
 *
 * @return {Object} JSON test data if valid, otherwise error object { err: message }
 */
function validateInFile(dataInFile) {
  let dataIn;
  // Was a JSON file provided?
  if (!dataInFile) {
    return { err: ERRORS.NO_FILE };
  }

  // Try to read and parse the file
  try {
    dataIn = JSON.parse(fs.readFileSync(dataInFile, 'utf-8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { err: ERRORS.NOT_FOUND(dataInFile) };
    } else if (JsonErrRegex.test(err.message)) {
      return { err: ERRORS.BAD_JSON };
    }
    return { err: ERRORS.GENERIC };
  }

  // Validate test report json against schema
  const validationResult = t.validate(dataIn, types.TestReport);
  if (!validationResult.isValid()) {
    return {
      err: ERRORS.INVALID_JSON(validationResult.errors.map(e => ` - ${e.message}`).join('\n'))
    };
  }

  return dataIn;
}

/**
 * Get options to send to report generator
 *
 * @param {Object} args Arguments passed in
 *
 * @return {Object} Options to pass to report generator
 */
function getOptions(args) {
  const { reportFilename, reportDir, reportTitle, reportPageTitle,
    inlineAssets, enableCharts, enableCode, autoOpen, dev } = args;
  const filename = `${reportFilename.replace(fileExtRegex, '')}.html`;
  return {
    reportHtmlFile: path.join(reportDir, filename),
    reportTitle,
    reportPageTitle,
    inlineAssets,
    enableCharts,
    enableCode,
    autoOpen,
    dev
  };
}

/**
 * Main CLI Program
 *
 * @param {Object} processArgs CLI arguments
 */
function mareport(processArgs) {
  const args = processArgs || { _: [] };

  // Try to load the test data
  const reportData = validateInFile(args._[0]);

  // Check for error in data load
  /* istanbul ignore else */
  if (reportData && reportData.err) {
    console.log(reportData.err);
    process.exitCode = 1;
    return;
  }

  // Good so far, now generate the report
  report.createSync(reportData, getOptions(args));
}

module.exports = mareport;
