'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fs = require('fs-extra');
var path = require('path');
var React = require('react');
var opener = require('opener');
var render = require('react-dom/server').renderToStaticMarkup;
var MainHTML = require('./main-html');

var distDir = path.join(__dirname, '..', 'dist');
var inlineAssetsDir = path.join(distDir, 'assets', 'inline');
var externalAssetsDir = path.join(distDir, 'assets', 'external');

/**
 * Private functions
 *
 */

/**
 * Saves a file
 *
 * @param {String} filename
 * @param {String} data
 * @returns {Promise}
 */

function saveFile(filename, data) {
  return new Promise(function (resolve, reject) {
    fs.outputFile(filename, data, function (err) {
      return err === null ? resolve(true) : reject(err);
    });
  });
}

/**
 * Synchronously loads a file with utf8 encoding
 *
 * @param {String} filename
 * @returns {String}
 */

function loadFile(filename) {
  return fs.readFileSync(filename, 'utf8');
}

/**
 * Get report options by extending base options
 * with user provided options
 *
 * @param {Object} opts
 * @returns {Object}
 */

function getOptions(opts) {
  var userOptions = opts || {};
  var baseOptions = {
    inlineAssets: false,
    reportDir: path.join('.', 'mochawesome-report'),
    reportFilename: 'mochawesome',
    reportTitle: process.cwd().split(path.sep).pop(),
    reportPageTitle: 'Mochawesome Report Card'
  };
  var mergedOptions = Object.assign(baseOptions, userOptions);

  // If reportHtmlFile option was not specifically provided,
  // create it based on the reportDir and reportFilename options
  if (!mergedOptions.reportHtmlFile) {
    mergedOptions.reportHtmlFile = path.join(mergedOptions.reportDir, mergedOptions.reportFilename + '.html');
  }
  return mergedOptions;
}

/**
 * Get the report assets for inline use
 *
 * @param {Object} opts
 * @returns {Object}
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
 * @param {Object} opts
 * @returns {Object}
 */

function copyAssets(opts) {
  // Copy the assets to the report location if they don't exist
  var assetsDir = path.join(opts.reportDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.copySync(externalAssetsDir, assetsDir);
  }
}

/**
 * Renders the main report React component
 *
 * @param {JSON} data
 * @param {Object} options
 * @param {String} styles
 * @param {String} scripts
 * @returns {String} html
 */

function renderHtml(data, options, styles, scripts) {
  return render(React.createElement(MainHTML, { data: data, options: options, styles: styles, scripts: scripts }));
}

/**
 * Prepare options, assets, and html for saving
 *
 * @param {String} data
 * @param {Object} opts
 * @returns {Object}
 */

function prepare(reportData, opts) {
  // Stringify the data if needed
  var data = reportData;
  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    data = JSON.stringify(reportData);
  }

  // Get the options
  var options = getOptions(opts);

  var assets = {};
  // If options.inlineAssets is true, get the
  // styles and scripts as strings
  if (!options.dev) {
    if (options.inlineAssets) {
      assets = getAssets(options);
    } else {
      // Otherwise copy the files to the assets dir
      copyAssets(options);
    }
  }

  // Render basic template to string
  var _assets = assets,
      styles = _assets.styles,
      scripts = _assets.scripts;

  var html = '<!doctype html>\n' + renderHtml(data, options, styles, scripts);
  return { html: html, reportFilename: options.reportHtmlFile, options: options };
}

/**
 * Exposed functions
 *
 */

function create(data, opts) {
  var _prepare = prepare(data, opts),
      html = _prepare.html,
      reportFilename = _prepare.reportFilename,
      options = _prepare.options;

  return saveFile(reportFilename, html).then(function () {
    if (options.autoOpen) opener(reportFilename);
  });
}

function createSync(data, opts) {
  var _prepare2 = prepare(data, opts),
      html = _prepare2.html,
      reportFilename = _prepare2.reportFilename,
      options = _prepare2.options;

  fs.outputFileSync(reportFilename, html);
  if (options.autoOpen) opener(reportFilename);
}

module.exports = { create: create, createSync: createSync };