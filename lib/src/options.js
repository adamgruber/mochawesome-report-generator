const path = require('path');
const isFunction = require('lodash.isfunction');

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
 * @property {string}  showHooks        Determines when hooks should display in the report
 *                                      Choices:
 *                                       - always: display all hooks
 *                                       - never: do not display hooks
 *                                       - failed: display only failed hooks (default)
 *                                       - context: display only hooks with context
 * @property {boolean} saveJson         Should report data be saved to JSON file (default: false)
 * @property {boolean} dev              Enable dev mode in the report,
 *                                      asssets loaded via webpack (default: false)
 * @property {string} filter            Determines the filters to be applied by default.
 *                                      Accepts a plus separated list:
 *                                        passed+failed+pending+skipped.
 *                                      If no filter is passed, all of them are applied.
 */
export const yargsOptions = {
  f: {
    alias: [ 'reportFilename' ],
    describe: 'Filename of saved report',
    string: true,
    requiresArg: true
  },
  o: {
    alias: [ 'reportDir' ],
    default: 'mochawesome-report',
    describe: 'Path to save report',
    string: true,
    normalize: true,
    requiresArg: true
  },
  t: {
    alias: [ 'reportTitle' ],
    default: function currentDir() {
      return process.cwd().split(path.sep).pop();
    },
    describe: 'Report title',
    string: true,
    requiresArg: true
  },
  p: {
    alias: [ 'reportPageTitle' ],
    default: 'Mochawesome Report',
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
    alias: [ 'ts' ],
    default: false,
    describe: 'Append timestamp in specified format to filename',
    string: true
  },
  showHooks: {
    default: 'failed',
    describe: 'Display hooks in the report',
    choices: [ 'always', 'never', 'failed', 'context' ]
  },
  saveJson: {
    default: false,
    describe: 'Save report data to JSON file',
    boolean: true
  },
  dev: {
    default: false,
    describe: 'Enable dev mode',
    boolean: true
  },
  filter: {
    default: 'all',
    describe: 'A plus separated list of filters to be applied by default',
    string: true
  }
};

/**
 * Return parsed user options merged with base config
 *
 * @param {Object} userOptions User-supplied options
 *
 * @return {Object} Merged options
 */
export const getMergedOptions = function (userOptions) {
  const mergedOptions = {};

  /**
   * Retrieve the value of a user supplied option.
   * Order of precedence
   *  1. User-supplied option
   *  2. Environment variable
   *
   * @param {string} optToGet  Option name
   * @param {boolean} isBool  Treat option as Boolean
   *
   * @return {string|boolean|undefined}  Option value
   */
  function _getUserOption(optToGet, isBool) {
    const envVar = `MOCHAWESOME_${optToGet.toUpperCase()}`;
    if (userOptions && typeof userOptions[optToGet] !== 'undefined') {
      return (isBool && typeof userOptions[optToGet] === 'string')
        ? userOptions[optToGet] === 'true'
        : userOptions[optToGet];
    }
    if (typeof process.env[envVar] !== 'undefined') {
      return isBool
        ? process.env[envVar] === 'true'
        : process.env[envVar];
    }
    return undefined;
  }

  /*
   * Helper to create properties and assign values in the mergedOptions object.
   * Properties with `undefined` values are ignored
   */
  function assignVal(prop, userVal, defaultVal) {
    const val = userVal !== undefined ? userVal : defaultVal;
    if (val !== undefined) {
      mergedOptions[prop] = val;
    }
  }

  Object.keys(yargsOptions).forEach(optKey => {
    const yargOpt = yargsOptions[optKey];
    const aliases = yargOpt.alias;
    const defaultVal = isFunction(yargOpt.default) ? yargOpt.default() : yargOpt.default;
    const isBool = yargOpt.boolean;
    let userVal = _getUserOption(optKey, isBool);

    // Most options are single-letter so we add the aliases as properties
    if (Array.isArray(aliases) && aliases.length) {
      // If the main prop does not have a user supplied value
      // we need to check the aliases, stopping if we get a user value
      if (userVal === undefined) {
        for (let i = 0; i < aliases.length; i += 1) {
          userVal = _getUserOption(aliases[i], isBool);
          if (userVal !== undefined) {
            break;
          }
        }
      }

      // Handle cases where the main option is not a single letter
      if (optKey.length > 1) assignVal(optKey, userVal, defaultVal);

      // Loop through aliases to set val
      aliases.forEach(alias => assignVal(alias, userVal, defaultVal));
    } else {
      // For options without aliases, use the option regardless of length
      assignVal(optKey, userVal, defaultVal);
    }
  });
  return mergedOptions;
};
