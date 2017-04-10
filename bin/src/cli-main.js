const fs = require('fs-extra');
const chalk = require('chalk');
const t = require('tcomb-validation');
const report = require('../lib/main');
const types = require('./types');
const logger = require('./logger');

const JsonErrRegex = /Unexpected token/;
const JsonFileRegex = /\.json{1}$/;
const mapJsonErrors = errors => errors.map(e => `  ${e.message}`).join('\n');
const ERRORS = {
  NOT_FOUND: '  File not found.',
  NOT_JSON: '  You must supply a valid JSON file.',
  GENERIC: '  There was a problem loading mochawesome data.',
  INVALID_JSON: errMsgs => mapJsonErrors(errMsgs),
  IS_DIR: '  Directories are not supported (yet).'
};
let validFiles = 0;

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
  let data;
  let err = null;

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
      err = ERRORS.INVALID_JSON([ e ]);
    } else {
      err = ERRORS.GENERIC;
    }
  }

  // If the file was loaded successfully,
  // validate the json against the TestReport schema
  if (data) {
    const validationResult = t.validate(data, types.TestReport);
    if (!validationResult.isValid()) {
      err = ERRORS.INVALID_JSON(validationResult.errors);
    } else {
      validFiles += 1;
    }
  }

  return {
    filename: file,
    data,
    err
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
  const saved = [];
  const errors = [];

  resolvedValues.forEach(value => {
    if (value.err) {
      errors.push(value);
    } else {
      saved.push(value[0]);
    }
  });

  if (saved.length) {
    logger.info(chalk.green('\n✓ Reports saved:'));
    logger.info(saved.map(savedFile => `${chalk.underline(savedFile)}`).join('\n'));
  }

  if (errors.length) {
    logger.info(chalk.red('\n✘ Some files could not be processed:'));
    logger.info(errors
      .map(e => `${chalk.underline(e.filename)}\n${chalk.dim(e.err)}`)
      .join('\n\n')
    );
  }
  return resolvedValues;
}

/**
 * Main CLI Program
 *
 * @param {Object} args CLI arguments
 *
 * @return {Promise} Resolved promises with saved files or errors
 */
function marge(args) {
  // Load and validate each file
  const files = args._.map(validateFile);

  // Set the overwrite option based on timestamp option
  /* istanbul ignore else */
  if (args.timestamp !== false || validFiles > 1) {
    args.overwrite = false;
  }

  const promises = files.map(file => (
    file.err ? Promise.resolve(file) : report.create(file.data, args)
  ));

  return Promise.all(promises)
    .then(handleResolved)
    .catch(handleError);
}

module.exports = marge;
