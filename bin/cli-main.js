'use strict';

/* eslint-disable no-console */
var path = require('path');
var fs = require('fs-extra');
var t = require('tcomb-validation');
var report = require('../lib/main');
var types = require('./types');

var JsonErrRegex = /^Unexpected token .* in JSON/;
var fileExtRegex = /\.[^.]*?$/;
var ERRORS = {
  NO_FILE: 'You must supply a mochawesome data file to create a report.',
  NOT_FOUND: function NOT_FOUND(filename) {
    return 'The data file: ' + filename + ' could not be found.';
  },
  BAD_JSON: 'There was a problem parsing mochawesome data. Please ensure the JSON file is valid.',
  GENERIC: 'There was a problem loading mochawesome data.',
  INVALID_JSON: function INVALID_JSON(errMsg) {
    return 'There was a problem parsing mochawesome data:\n' + errMsg;
  }
};

/**
 * Validate the data file
 *
 * @param {string} dataInFile Filename of test data
 *
 * @return {Object} JSON test data if valid, otherwise error object { err: message }
 */
function validateInFile(dataInFile) {
  var dataIn = void 0;
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
  var validationResult = t.validate(dataIn, types.TestReport);
  if (!validationResult.isValid()) {
    return {
      err: ERRORS.INVALID_JSON(validationResult.errors.map(function (e) {
        return ' - ' + e.message;
      }).join('\n'))
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
  var reportFilename = args.reportFilename,
      reportDir = args.reportDir,
      reportTitle = args.reportTitle,
      reportPageTitle = args.reportPageTitle,
      inlineAssets = args.inlineAssets,
      enableCharts = args.enableCharts,
      enableCode = args.enableCode,
      autoOpen = args.autoOpen,
      dev = args.dev;

  var filename = reportFilename.replace(fileExtRegex, '') + '.html';
  return {
    reportHtmlFile: path.join(reportDir, filename),
    reportTitle: reportTitle,
    reportPageTitle: reportPageTitle,
    inlineAssets: inlineAssets,
    enableCharts: enableCharts,
    enableCode: enableCode,
    autoOpen: autoOpen,
    dev: dev
  };
}

/**
 * Main CLI Program
 *
 * @param {Object} processArgs CLI arguments
 */
function mareport(processArgs) {
  var args = processArgs || { _: [] };

  // Try to load the test data
  var reportData = validateInFile(args._[0]);

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