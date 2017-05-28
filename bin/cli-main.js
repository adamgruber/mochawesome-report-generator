'use strict';

var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var t = require('tcomb-validation');
var report = require('../lib/main');
var types = require('./types');
var logger = require('./logger');

var JsonErrRegex = /Unexpected token/;
var JsonFileRegex = /\.json{1}$/;
var mapJsonErrors = function mapJsonErrors(errors) {
  return errors.map(function (e) {
    return '  ' + e.message;
  }).join('\n');
};
var ERRORS = {
  NOT_FOUND: '  File not found.',
  NOT_JSON: '  You must supply a valid JSON file.',
  GENERIC: '  There was a problem loading mochawesome data.',
  INVALID_JSON: function INVALID_JSON(errMsgs) {
    return mapJsonErrors(errMsgs);
  },
  IS_DIR: '  Directories are not supported (yet).'
};
var validFiles = void 0;

/**
 * Validate the data file
 *
 * @typedef {Object} File
 * @property {string} filename Name of the file
 * @property {object} data JSON test data
 * @property {object} err Error object
 *
 * @param {string} file File to load/validate
 *
 * @return {File} Validated file with test data, `err` will be null if valid
 */
function validateFile(file) {
  var data = void 0;
  var err = null;

  // Try to read and parse the file
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    if (e.code === 'ENOENT') {
      err = ERRORS.NOT_FOUND;
    } else if (e.code === 'EISDIR') {
      err = ERRORS.IS_DIR;
    } else if (!JsonFileRegex.test(file)) {
      err = ERRORS.NOT_JSON;
    } else if (JsonErrRegex.test(e.message)) {
      err = ERRORS.INVALID_JSON([e]);
    } else {
      err = ERRORS.GENERIC;
    }
  }

  // If the file was loaded successfully,
  // validate the json against the TestReport schema
  if (data) {
    var validationResult = t.validate(data, types.TestReport, { strict: true });
    if (!validationResult.isValid()) {
      err = ERRORS.INVALID_JSON(validationResult.errors);
    } else {
      validFiles += 1;
    }
  }

  return {
    filename: file,
    data: data,
    err: err
  };
}

/**
 * Set exit code and throw caught errors
 *
 * @param {Object|string} err Error object or error message
 *
 */
function handleError(err) {
  process.exitCode = 1;
  throw new Error(err);
}

/**
 * Loop through resolved promises to log the appropriate messages
 *
 * @param {Array} resolvedValues Result of promise.all
 *
 * @return {Array} Array of resolved promise values
 */
function handleResolved(resolvedValues) {
  var saved = [];
  var errors = [];

  resolvedValues.forEach(function (value) {
    if (value.err) {
      errors.push(value);
    } else {
      saved.push(value[0]);
    }
  });

  if (saved.length) {
    logger.info(chalk.green('\n✓ Reports saved:'));
    logger.info(saved.map(function (savedFile) {
      return '' + chalk.underline(savedFile);
    }).join('\n'));
  }

  if (errors.length) {
    logger.info(chalk.red('\n✘ Some files could not be processed:'));
    logger.info(errors.map(function (e) {
      return chalk.underline(e.filename) + '\n' + chalk.dim(e.err);
    }).join('\n\n'));
    process.exitCode = 1;
  }
  return resolvedValues;
}

/**
 * Get the reportFilename option to be passed to report.create
 *
 * Returns the `reportFilename` option if provided otherwise
 * it returns the base filename stripped of path and extension
 *
 * @param {Object} file.filename Name of file to be processed
 * @param {Object} args CLI process arguments
 *
 * @return {string} Filename
 */
function getReportFilename(_ref, _ref2) {
  var filename = _ref.filename;
  var reportFilename = _ref2.reportFilename;

  return reportFilename || filename.split(path.sep).pop().replace(JsonFileRegex, '');
}

/**
 * Main CLI Program
 *
 * @param {Object} args CLI arguments
 *
 * @return {Promise} Resolved promises with saved files or errors
 */
function marge(args) {
  // Reset valid files count
  validFiles = 0;

  // Load and validate each file
  var files = args._.map(validateFile);

  // When there are multiple valid files OR the timestamp option is set
  // we must force `overwrite` to `false` to ensure all reports are created
  /* istanbul ignore else */
  if (validFiles > 1 || args.timestamp !== false) {
    args.overwrite = false;
  }

  var promises = files.map(function (file) {
    // Files with errors we just resolve
    if (file.err) {
      return Promise.resolve(file);
    }

    // Valid files get created but first we need to pass correct filename option
    // Default value is name of file

    // If a filename option was provided, all files get that name
    var reportFilename = getReportFilename(file, args);
    return report.create(file.data, Object.assign({}, args, { reportFilename: reportFilename }));
  });

  return Promise.all(promises).then(handleResolved).catch(handleError);
}

module.exports = marge;