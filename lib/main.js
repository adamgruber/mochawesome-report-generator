/* eslint-disable no-console */
require('babel-core/register');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const React = require('react');
const render = require('react-dom/server').renderToStaticMarkup;
const MainHTML = require('../src/components/main');

const distDir = path.join(__dirname, '..', 'dist', 'assets');
/**
 * Private functions
 *
 */

/**
 * Creates a new directory
 *
 * @param {String} dir
 * @returns {Promise}
 */

function makeDir(dir) {
  return new Promise((resolve, reject) => {
    mkdirp(dir, (err, made) => err === null ? resolve(made) : reject(err));
  });
}

/**
 * Saves a file
 *
 * @param {String} filename
 * @param {String} data
 * @returns {Promise}
 */

function saveFile(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => err === null ? resolve(true) : reject(err));
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
 * Get the report options
 *
 * @param {Object} opts
 * @returns {Object}
 */

function getOptions(opts) {
  return Object.assign(opts, {
    inlineAssets: true
    // reportFilename: path.join(distDir, 'report.html')
  });
}

/**
 * Get the report assets for inline use
 *
 * @param {Object} opts
 * @returns {Object}
 */

function getAssets() {
  return {
    styles: loadFile(path.join(distDir, 'app.css')),
    scripts: loadFile(path.join(distDir, 'app.js'))
  };
}

/**
 * Copy the report assets to the report dir
 *
 * @param {Object} opts
 * @returns {Object}
 */

function copyAssets(opts) {
  // Create the assets dir
  const assetsDir = path.join(opts.reportDir, 'assets');
  mkdirp.sync(assetsDir);
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
  return render(React.createElement(MainHTML, { data, options, styles, scripts }));
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
  let data = reportData;
  if (typeof data === 'object') {
    data = JSON.stringify(reportData);
  }

  // Get the options
  const options = getOptions(opts);
  console.log(options);

  let assets = {};
  // If options.inlineAssets is true, get the
  // styles and scripts as strings
  if (options.inlineAssets) {
    assets = getAssets(options);
  } else {
  // Otherwise copy the files to the assets dir
    copyAssets();
  }


  // Render basic template to string
  const { styles, scripts } = assets;
  const html = renderHtml(data, options, styles, scripts);
  return { html, reportFilename: options.reportHtmlFile };
}

/**
 * Exposed functions
 *
 */

function create(data, opts) {
  const { html, reportFilename } = prepare(data, opts);
  return saveFile(reportFilename, `<!doctype html>\n${html}`);
}

function createSync(data, opts) {
  const { html, reportFilename } = prepare(data, opts);
  console.log(reportFilename);
  fs.writeFileSync(reportFilename, `<!doctype html>\n${html}`);
}

module.exports = { create, createSync };
