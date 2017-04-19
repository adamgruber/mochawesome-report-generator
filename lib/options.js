'use strict';

var path = require('path');
var isFunction = require('lodash.isfunction');

/** CLI Arguments
 *
 * @argument {string} test-data Data to use for rendering report
 *
 * @property {string}  reportFilename   Filename of saved report
 * @property {string}  reportDir        Path to save report to (default: cwd/mochawesome-report)
 * @property {string}  reportTitle      Title to use on the report (default: mochawesome)
 * @property {string}  reportPageTitle  Title of the report document (default: mochawesome-report)
 * @property {boolean} inlineAssets     Should assets be inlined into HTML file (default: false)
 * @property {boolean} charts           Should charts be enabled (default: true)
 * @property {boolean} code             Should test code output be enabled (default: true)
 * @property {boolean} autoOpen         Open the report after creation (default: false)
 * @property {boolean} overwrite        Overwrite existing files (default: true)
 * @property {string}  timestamp        Append timestamp in specified format to the filename.
 *                                      Ensures a new file is created on each run.
 *                                      Accepts any format string that dateformat can handle.
 *                                      See https://github.com/felixge/node-dateformat
 *                                      Defaults to 'isoDateTime' when no format is specified
 * @property {boolean} dev              Enable dev mode in the report,
 *                                      asssets loaded via webpack (default: false)
 */
var yargsOptions = {
  f: {
    alias: ['reportFilename'],
    describe: 'Filename of saved report',
    string: true,
    requiresArg: true
  },
  o: {
    alias: ['reportDir'],
    default: 'mochawesome-report',
    describe: 'Path to save report',
    string: true,
    normalize: true,
    requiresArg: true
  },
  t: {
    alias: ['reportTitle'],
    default: function currentDir() {
      return process.cwd().split(path.sep).pop();
    },
    describe: 'Report title',
    string: true,
    requiresArg: true
  },
  p: {
    alias: ['reportPageTitle'],
    default: 'Mochawesome Report',
    describe: 'Browser title',
    string: true,
    requiresArg: true
  },
  i: {
    alias: ['inline', 'inlineAssets'],
    default: false,
    describe: 'Inline report assets (styles, scripts)',
    boolean: true
  },
  charts: {
    alias: ['enableCharts'],
    default: true,
    describe: 'Display charts',
    boolean: true
  },
  code: {
    alias: ['enableCode'],
    default: true,
    describe: 'Display test code',
    boolean: true
  },
  autoOpen: {
    default: false,
    describe: 'Automatically open the report HTML',
    boolean: true
  },
  overwrite: {
    default: true,
    describe: 'Overwrite existing files when saving',
    boolean: true
  },
  timestamp: {
    alias: ['ts'],
    default: false,
    describe: 'Append timestamp in specified format to filename',
    string: true
  },
  dev: {
    default: false,
    describe: 'Enable dev mode',
    boolean: true
  }
};

/**
 * Return the Yargs options object
 *
 * @return {Object} Yargs options
 */
function getYargsOptions() {
  return yargsOptions;
}

/**
 * Extract the base configuration object
 * from the Yargs options object
 *
 * @return {Object} Base config
 */
function getBaseConfig() {
  var baseConfig = {};

  // Helper to create properties and assign values in the baseConfig object.
  // `undefined` values will cause the property to be ignored
  function assignVal(prop, val) {
    if (val !== undefined) {
      baseConfig[prop] = val;
    }
  }

  Object.keys(yargsOptions).forEach(function (optKey) {
    var yargOpt = yargsOptions[optKey];
    var aliases = yargOpt.alias;
    var defaultVal = isFunction(yargOpt.default) ? yargOpt.default() : yargOpt.default;

    // Most options are single-letter so we add the aliases as properties
    if (Array.isArray(aliases) && aliases.length) {
      // Handle cases where the main option is not single-letter
      if (optKey.length > 1) assignVal(optKey, defaultVal);
      aliases.forEach(function (alias) {
        return assignVal(alias, defaultVal);
      });
    } else {
      // For options without aliases, use the option regardless of length
      assignVal(optKey, defaultVal);
    }
  });
  return baseConfig;
}

module.exports = { getYargsOptions: getYargsOptions, getBaseConfig: getBaseConfig };