'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fs = require('fs-extra');
var fsu = require('fsu');
var path = require('path');
var React = require('react');
var opener = require('opener');
var dateFormat = require('dateformat');
var render = require('react-dom/server').renderToStaticMarkup;
var MainHTML = require('./main-html');
var pkg = require('../package.json');
var options = require('./options');

var distDir = path.join(__dirname, '..', 'dist');
var inlineAssetsDir = path.join(distDir, 'assets', 'inline');
var externalAssetsDir = path.join(distDir, 'assets', 'external');
var fileExtRegex = /\.[^.]*?$/;

/**
 * Saves a file
 *
 * @param {string} filename Name of file to save
 * @param {string} data Data to be saved
 * @param {boolean} overwrite Overwrite existing files (default: true)
 *
 * @return {Promise} Resolves with filename if successfully saved
 */
function saveFile(filename, data, overwrite) {
  if (overwrite) {
    return fs.outputFile(filename, data);
  } else {
    return new Promise(function (resolve, reject) {
      fsu.writeFileUnique(filename.replace(fileExtRegex, '{_###}$&'), data, { force: true }, function (err, savedFile) {
        return err === null ? resolve(savedFile) : reject(err);
      });
    });
  }
}

/**
 * Opens a file
 *
 * @param {string} filename Name of file to open
 *
 * @return {Promise} Resolves with filename if successfully opened
 */
function openFile(filename) {
  return new Promise(function (resolve, reject) {
    opener(filename, null, function (err) {
      return err === null ? resolve(filename) : reject(err);
    });
  });
}

/**
 * Synchronously loads a file with utf8 encoding
 *
 * @param {string} filename Name of file to load
 *
 * @return {string} File data as string
 */
function loadFile(filename) {
  return fs.readFileSync(filename, 'utf8');
}

/**
 * Get the dateformat format string based on the timestamp option
 *
 * @param {string|boolean} timestamp Timestamp option value
 *
 * @return {string} Valid dateformat format string
 */
function getTimestampFormat(timestamp) {
  switch (timestamp) {
    case '':
    case 'true':
    case true:
      return 'isoDateTime';
    default:
      return timestamp;
  }
}

/**
 * Construct the path/name of the HTML/JSON file to be saved
 *
 * @param {Object} reportOptions Options object
 * @param {string} reportOptions.reportDir Directory to save report to
 * @param {string} reportOptions.reportFilename Filename to save report to
 * @param {string} reportOptions.timestamp Timestamp format to be appended to the filename
 *
 * @return {string} Fully resolved path without extension
 */
function getFilename(_ref) {
  var reportDir = _ref.reportDir,
      _ref$reportFilename = _ref.reportFilename,
      reportFilename = _ref$reportFilename === undefined ? 'mochawesome' : _ref$reportFilename,
      timestamp = _ref.timestamp;

  var ts = '';
  if (timestamp !== false && timestamp !== 'false') {
    var format = getTimestampFormat(timestamp);
    ts = ('_' + dateFormat(new Date(), format)
    // replace commas, spaces or comma-space combinations with underscores
    ).replace(/(,\s*)|,|\s+/g, '_')
    // replace forward and back slashes with hyphens
    .replace(/\\|\//g, '-')
    // remove colons
    .replace(/:/g, '');
  }
  var filename = '' + reportFilename.replace(fileExtRegex, '') + ts;
  return path.resolve(process.cwd(), reportDir, filename);
}

/**
 * Get report options by extending base options
 * with user provided options
 *
 * @param {Object} opts Report options
 *
 * @return {Object} User options merged with default options
 */
function getOptions(opts) {
  var userOptions = opts || {};
  var baseOptions = options.getBaseConfig();
  var mergedOptions = Object.assign(baseOptions, userOptions);

  // For saving JSON from mochawesome reporter
  if (mergedOptions.saveJson) {
    mergedOptions.jsonFile = getFilename(mergedOptions) + '.json';
  }
  mergedOptions.htmlFile = getFilename(mergedOptions) + '.html';
  return mergedOptions;
}

/**
 * Get the report assets for inline use
 *
 * @return {Object} Object with styles and scripts as strings
 */
function getAssets() {
  return {
    styles: loadFile(path.join(inlineAssetsDir, 'app.css')),
    scripts: loadFile(path.join(inlineAssetsDir, 'app.js'))
  };
}

/**
 * Copy the report assets to the report dir
 *
 * This function follows the below logic to determine whether or not to copy the assets
 * - Assets folder does not exist -> copy assets
 * - Assets folder exists -> load the css asset to inspect the banner
 * - Error loading css file -> copy assets
 * - Read the package version from the css asset
 * - Asset version is not found -> copy assets
 * - Asset version differs from current version -> copy assets
 *
 * @param {Object} opts Report options
 *
 */
function copyAssets(opts) {
  var assetsDir = path.join(opts.reportDir, 'assets');
  var assetsExist = fs.existsSync(assetsDir);
  if (!assetsExist) {
    fs.copySync(externalAssetsDir, assetsDir);
  } else {
    try {
      var appCss = loadFile(path.join(assetsDir, 'app.css'));
      var appCssVersion = /\d+\.\d+\.\d+/.exec(appCss);
      if (!appCssVersion || appCssVersion[0] !== pkg.version) {
        fs.copySync(externalAssetsDir, assetsDir);
      }
    } catch (e) {
      fs.copySync(externalAssetsDir, assetsDir);
    }
  }
}

/**
 * Renders the main report React component
 *
 * @param {Object} data JSON test data
 * @param {Object} reportOptions Report options
 * @param {string} styles Inline stylesheet
 * @param {string} scripts Inline script
 *
 * @return {string} Rendered HTML string
 */
function renderHtml(data, reportOptions, styles, scripts) {
  return render(React.createElement(MainHTML, {
    data: data,
    options: reportOptions,
    styles: styles,
    scripts: scripts
  }));
}

/**
 * Prepare options, assets, and html for saving
 *
 * @param {string} reportData JSON test data
 * @param {Object} opts Report options
 *
 * @return {Object} Prepared data for saving
 */
function prepare(reportData, opts) {
  // Stringify the data if needed
  var data = reportData;
  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    data = JSON.stringify(reportData);
  }

  // Get the options
  var reportOptions = getOptions(opts);

  var assets = {};
  // If options.inlineAssets is true, get the
  // styles and scripts as strings
  if (!reportOptions.dev) {
    if (reportOptions.inlineAssets) {
      assets = getAssets(reportOptions);
    } else {
      // Otherwise copy the files to the assets dir
      copyAssets(reportOptions);
    }
  }

  // Render basic template to string
  var _assets = assets,
      styles = _assets.styles,
      scripts = _assets.scripts;

  var html = '<!doctype html>\n' + renderHtml(data, reportOptions, styles, scripts);
  return { html: html, reportData: data, reportOptions: reportOptions };
}

/**
 * Create the report
 *
 * @param {string} data JSON test data
 * @param {Object} opts Report options
 *
 * @return {Promise} Resolves if report was created successfully
 */
function create(data, opts) {
  var _prepare = prepare(data, opts),
      html = _prepare.html,
      reportData = _prepare.reportData,
      reportOptions = _prepare.reportOptions;

  var saveJson = reportOptions.saveJson,
      autoOpen = reportOptions.autoOpen,
      overwrite = reportOptions.overwrite,
      jsonFile = reportOptions.jsonFile,
      htmlFile = reportOptions.htmlFile;


  var savePromises = [saveFile(htmlFile, html, overwrite).then(function (savedHtml) {
    return autoOpen && openFile(savedHtml) || savedHtml;
  })];

  if (saveJson) {
    savePromises.push(saveFile(jsonFile, reportData, overwrite));
  }

  return Promise.all(savePromises);
}

/**
 * Create the report synchronously
 *
 * @param {string} data JSON test data
 * @param {Object} opts Report options
 *
 */
function createSync(data, opts) {
  var _prepare2 = prepare(data, opts),
      html = _prepare2.html,
      reportOptions = _prepare2.reportOptions;

  var autoOpen = reportOptions.autoOpen,
      htmlFile = reportOptions.htmlFile;

  fs.outputFileSync(htmlFile, html);
  if (autoOpen) opener(htmlFile);
}

/**
 * Expose functions
 *
 */
module.exports = { create: create, createSync: createSync, getBaseConfig: options.getBaseConfig };