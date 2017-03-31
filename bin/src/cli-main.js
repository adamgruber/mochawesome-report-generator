const fs = require('fs-extra');
const t = require('tcomb-validation');
const report = require('../lib/main');
const types = require('./types');
const logger = require('./logger');

const JsonErrRegex = /^Unexpected token .* in JSON|SyntaxError/;
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
 * Handle errors
 *
 * @param {Object|string} err Error object or error message
 *
 */
function handleError(err) {
  const msg = err.message || err;
  logger.error(msg);
  process.exitCode = 1;
}

/**
 * Main CLI Program
 *
 * @param {Object} processArgs CLI arguments
 *
 * @return {Promise|false} Promise if create was attempted, otherwise false
 */
function mareport(processArgs) {
  const args = processArgs || { _: [] };

  // Try to load the test data
  const reportData = validateInFile(args._[0]);

  // Set the overwrite option based on timestamp option
  if (args.timestamp !== false) {
    args.overwrite = false;
  }

  return (reportData && reportData.err)
    ? handleError(reportData.err)
    : report.create(reportData, args)
      .then(([ savedHtmlFile ]) => logger.info(`Report saved to ${savedHtmlFile}`))
      .catch(handleError);
}

module.exports = mareport;
