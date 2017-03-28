const fs = require('fs-extra');
const fsu = require('fsu');
const path = require('path');
const React = require('react');
const opener = require('opener');
const render = require('react-dom/server').renderToStaticMarkup;
const MainHTML = require('./main-html');
const pkg = require('../package.json');

const distDir = path.join(__dirname, '..', 'dist');
const inlineAssetsDir = path.join(distDir, 'assets', 'inline');
const externalAssetsDir = path.join(distDir, 'assets', 'external');
const fileExtRegex = /\.[^.]*?$/;

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
  return new Promise((resolve, reject) => {
    overwrite
      ? fs.outputFile(filename, data,
          err => err === null ? resolve(filename) : reject(err)
        )
      : fsu.writeFileUnique(filename.replace(fileExtRegex, '{_###}$&'), data, { force: true },
          (err, savedFile) => err === null ? resolve(savedFile) : reject(err)
        );
  });
}

/**
 * Opens a file
 *
 * @param {string} filename Name of file to open
 *
 * @return {Promise} Resolves with filename if successfully opened
 */
function openFile(filename) {
  return new Promise((resolve, reject) => {
    opener(filename, null, err => err === null ? resolve(filename) : reject(err));
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
 * Construct the path/name of the HTML/JSON file to be saved
 *
 * @param {Object} options Options  object
 * @param {string} options.reportDir Directory to save report to
 * @param {string} options.reportFilename Filename to save report to
 * @param {boolean} options.timestamp Should a timestamp be appended to the filename
 *
 * @return {string} Fully resolved path without extension
 */
function getFilename({ reportDir, reportFilename, timestamp }) {
  let ts = '';
  if (timestamp) {
    ts = `_${new Date().getTime()}`;
  }
  const filename = `${reportFilename.replace(fileExtRegex, '')}${ts}`;
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
  const userOptions = opts || {};
  const baseOptions = {
    inlineAssets: false,
    reportDir: 'mochawesome-report',
    reportFilename: 'mochawesome',
    reportTitle: process.cwd().split(path.sep).pop(),
    reportPageTitle: 'Mochawesome Report Card',
    overwrite: true,
    timestamp: false
  };
  const mergedOptions = Object.assign(baseOptions, userOptions);

  mergedOptions.jsonFile = `${getFilename(mergedOptions)}.json`;
  mergedOptions.htmlFile = `${getFilename(mergedOptions)}.html`;
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
 * @param {Object} data JSON test data
 * @param {Object} options Report options
 * @param {string} styles Inline stylesheet
 * @param {string} scripts Inline script
 *
 * @return {string} Rendered HTML string
 */
function renderHtml(data, options, styles, scripts) {
  return render(React.createElement(MainHTML, { data, options, styles, scripts }));
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
  return { html, reportData: data, options };
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
  const { html, reportData, options } = prepare(data, opts);
  const { saveJson, autoOpen, timestamp, overwrite, jsonFile, htmlFile } = options;
  const shouldOverwrite = timestamp ? false : overwrite;

  const savePromises = [
    saveFile(htmlFile, html, shouldOverwrite)
      .then(savedHtml => (autoOpen && openFile(savedHtml)) || savedHtml)
  ];

  if (saveJson) {
    savePromises.push(saveFile(jsonFile, reportData, shouldOverwrite));
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
  const { html, options } = prepare(data, opts);
  const { autoOpen, htmlFile } = options;
  fs.outputFileSync(htmlFile, html);
  if (autoOpen) opener(htmlFile);
}

/**
 * Expose create/createSync functions
 *
 */
module.exports = { create, createSync };
