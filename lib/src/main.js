const fs = require('fs-extra');
const path = require('path');
const React = require('react');
const opener = require('opener');
const render = require('react-dom/server').renderToStaticMarkup;
const MainHTML = require('./main-html');
const pkg = require('../package.json');

const distDir = path.join(__dirname, '..', 'dist');
const inlineAssetsDir = path.join(distDir, 'assets', 'inline');
const externalAssetsDir = path.join(distDir, 'assets', 'external');

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
  return new Promise((resolve, reject) => {
    fs.outputFile(filename, data, err => err === null ? resolve(true) : reject(err));
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
  const userOptions = opts || {};
  const baseOptions = {
    inlineAssets: false,
    reportDir: path.join('.', 'mochawesome-report'),
    reportFilename: 'mochawesome',
    reportTitle: process.cwd().split(path.sep).pop(),
    reportPageTitle: 'Mochawesome Report Card'
  };
  const mergedOptions = Object.assign(baseOptions, userOptions);

  // If reportHtmlFile option was not specifically provided,
  // create it based on the reportDir and reportFilename options
  if (!mergedOptions.reportHtmlFile) {
    mergedOptions.reportHtmlFile = path.join(
      mergedOptions.reportDir, `${mergedOptions.reportFilename}.html`
    );
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
 * This function follows the below logic to determine whether or not to copy the assets
 * - Assets folder does not exist -> copy assets
 * - Assets folder exists -> load the css asset to inspect the banner
 * - Error loading css file -> copy assets
 * - Read the package version from the css asset
 * - Asset version is not found -> copy assets
 * - Asset version differs from current version -> copy assets
 *
 * @param {Object} opts
 * @returns {Object}
 */

function copyAssets(opts) {
  const assetsDir = path.join(opts.reportDir, 'assets');
  const assetsExist = fs.existsSync(assetsDir);
  if (!assetsExist) {
    fs.copySync(externalAssetsDir, assetsDir);
  } else {
    try {
      const appCss = loadFile(path.join(assetsDir, 'app.css'));
      const appCssVersion = /\d+\.\d+\.\d+/.exec(appCss);
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

  let assets = {};
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
  const { styles, scripts } = assets;
  const html = `<!doctype html>\n${renderHtml(data, options, styles, scripts)}`;
  return { html, reportFilename: options.reportHtmlFile, options };
}

/**
 * Exposed functions
 *
 */

function create(data, opts) {
  const { html, reportFilename, options } = prepare(data, opts);
  return saveFile(reportFilename, html)
    .then(() => { if (options.autoOpen) opener(reportFilename); });
}

function createSync(data, opts) {
  const { html, reportFilename, options } = prepare(data, opts);
  fs.outputFileSync(reportFilename, html);
  if (options.autoOpen) opener(reportFilename);
}

module.exports = { create, createSync };
