const fs = require('fs-extra');
const fsu = require('fsu');
const path = require('path');
const opener = require('opener');
const dateFormat = require('dateformat');
const renderMainHTML = require('./main-html');
const pkg = require('../package.json');
const { getMergedOptions } = require('./options');

const distDir = path.join(__dirname, '..', 'dist');
const fileExtRegex = /\.[^.]*?$/;
const htmlJsonExtRegex = /\.(?:html|json)$/;
const semverRegex = /\d+\.\d+\.\d+(?:-(alpha|beta)\.\d+)?/;

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
    return fs.outputFile(filename, data).then(() => filename);
  }

  return new Promise((resolve, reject) => {
    fsu.writeFileUnique(
      filename.replace(fileExtRegex, '{_###}$&'),
      data,
      { force: true },
      (err, savedFile) => (err === null ? resolve(savedFile) : reject(err))
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
    opener(filename, null, err =>
      err === null ? resolve(filename) : reject(err)
    );
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
 * @param {string|boolean} ts Timestamp option value
 *
 * @return {string} Valid dateformat format string
 */
function getTimestampFormat(ts) {
  return ts === '' ||
    ts === true ||
    ts === 'true' ||
    ts === false ||
    ts === 'false'
    ? 'isoDateTime'
    : ts;
}

/**
 * Construct the path/name of the HTML/JSON file to be saved
 *
 * @param {object} reportOptions Options object
 * @param {string} reportOptions.reportDir Directory to save report to
 * @param {string} reportOptions.reportFilename Filename to save report to
 * @param {string} reportOptions.timestamp Timestamp format to be appended to the filename
 * @param {object} reportData JSON test data
 *
 * @return {string} Fully resolved path without extension
 */
function getFilename({ reportDir, reportFilename, timestamp }, reportData) {
  const DEFAULT_FILENAME = 'mochawesome';
  const NAME_REPLACE = '[name]';
  const STATUS_REPLACE = '[status]';
  const DATETIME_REPLACE = '[datetime]';
  const STATUSES = {
    Pass: 'pass',
    Fail: 'fail',
  };

  let filename = reportFilename || DEFAULT_FILENAME;

  const hasDatetimeReplacement = filename.includes(DATETIME_REPLACE);
  const tsFormat = getTimestampFormat(timestamp);
  const ts = dateFormat(new Date(), tsFormat)
    // replace commas, spaces or comma-space combinations with underscores
    .replace(/(,\s*)|,|\s+/g, '_')
    // replace forward and back slashes with hyphens
    .replace(/\\|\//g, '-')
    // remove colons
    .replace(/:/g, '');

  if (timestamp !== false && timestamp !== 'false') {
    if (!hasDatetimeReplacement) {
      filename = `${filename}_${DATETIME_REPLACE}`;
    }
  }

  const specFilename = path
    .basename(reportData.results[0]?.file || '')
    .replace(/\..+/, '');

  const status = reportData.stats.failures > 0 ? STATUSES.Fail : STATUSES.Pass;

  filename = filename
    .replace(NAME_REPLACE, specFilename || DEFAULT_FILENAME)
    .replace(STATUS_REPLACE, status)
    .replace(DATETIME_REPLACE, ts)
    .replace(htmlJsonExtRegex, '');

  return path.resolve(process.cwd(), reportDir, filename);
}

/**
 * Get report options by extending base options
 * with user provided options
 *
 * @param {object} opts Report options
 * @param {object} reportData JSON test data
 *
 * @return {object} User options merged with default options
 */
function getOptions(opts, reportData) {
  const mergedOptions = getMergedOptions(opts || {});
  const filename = getFilename(mergedOptions, reportData);

  // For saving JSON from mochawesome reporter
  if (mergedOptions.saveJson) {
    mergedOptions.jsonFile = `${filename}.json`;
  }

  mergedOptions.htmlFile = `${filename}.html`;
  return mergedOptions;
}

/**
 * Determine if assets should be copied following below logic:
 * - Assets folder does not exist -> copy assets
 * - Assets folder exists -> load the css asset to inspect the banner
 * - Error loading css file -> copy assets
 * - Read the package version from the css asset
 * - Asset version is not found -> copy assets
 * - Asset version differs from current version -> copy assets
 *
 * @param {string} assetsDir Directory where assets should be saved
 *
 * @return {boolean} Should assets be copied
 */
function _shouldCopyAssets(assetsDir) {
  if (!fs.existsSync(assetsDir)) {
    return true;
  }

  try {
    const appCss = loadFile(path.join(assetsDir, 'app.css'));
    const appCssVersion = semverRegex.exec(appCss);
    if (!appCssVersion || appCssVersion[0] !== pkg.version) {
      return true;
    }
  } catch (e) {
    return true;
  }

  return false;
}

/**
 * Copy the report assets to the report dir, ignoring inline assets
 *
 * @param {object} opts Report options
 */
function copyAssets({ assetsDir }) {
  if (_shouldCopyAssets(assetsDir)) {
    fs.copySync(distDir, assetsDir, {
      filter: src => !/inline/.test(src),
    });
  }
}

/**
 * Get the report assets object
 *
 * @param {object} reportOptions Options
 * @return {object} Object with assets props
 */
function getAssets(reportOptions) {
  const { assetsDir, cdn, dev, inlineAssets, reportDir } = reportOptions;
  const relativeAssetsDir = path.relative(reportDir, assetsDir);

  // Default URLs to assets path
  const assets = {
    inlineScripts: null,
    inlineStyles: null,
    scriptsUrl: path.join(relativeAssetsDir, 'app.js'),
    stylesUrl: path.join(relativeAssetsDir, 'app.css'),
  };

  // If using inline assets, load files and strings
  if (inlineAssets) {
    assets.inlineScripts = loadFile(path.join(distDir, 'app.js'));
    assets.inlineStyles = loadFile(path.join(distDir, 'app.inline.css'));
  }

  // If using CDN, return remote urls
  if (cdn) {
    assets.scriptsUrl = `https://unpkg.com/mochawesome-report-generator@${
      pkg.version
    }/dist/app.js`;
    assets.stylesUrl = `https://unpkg.com/mochawesome-report-generator@${
      pkg.version
    }/dist/app.css`;
  }

  // In DEV mode, return local urls
  if (dev) {
    assets.scriptsUrl = 'http://localhost:8080/app.js';
    assets.stylesUrl = 'http://localhost:8080/app.css';
  }

  // Copy the assets if needed
  if (!dev && !cdn && !inlineAssets) {
    copyAssets(reportOptions);
  }

  return assets;
}

/**
 * Prepare options, assets, and html for saving
 *
 * @param {object} reportData JSON test data
 * @param {object} opts Report options
 *
 * @return {object} Prepared data for saving
 */
function prepare(reportData, opts) {
  // Get the options
  const reportOptions = getOptions(opts, reportData);

  // Stop here if we're not generating an HTML report
  if (!reportOptions.saveHtml) {
    return { reportOptions };
  }

  // Get the assets
  const assets = getAssets(reportOptions);

  // Render basic template to string
  const renderedHtml = renderMainHTML({
    data: JSON.stringify(reportData),
    options: reportOptions,
    title: reportOptions.reportPageTitle,
    useInlineAssets: reportOptions.inlineAssets && !reportOptions.cdn,
    ...assets,
  });

  const html = `<!doctype html>\n${renderedHtml}`;
  return { html, reportOptions };
}

/**
 * Create the report
 *
 * @param {object} data JSON test data
 * @param {object} opts Report options
 *
 * @return {Promise} Resolves if report was created successfully
 */
function create(data, opts) {
  const { html, reportOptions } = prepare(data, opts);
  const {
    saveJson,
    saveHtml,
    autoOpen,
    overwrite,
    jsonFile,
    htmlFile,
  } = reportOptions;

  const savePromises = [];

  savePromises.push(
    saveHtml !== false
      ? saveFile(htmlFile, html, overwrite).then(
          savedHtml => (autoOpen && openFile(savedHtml)) || savedHtml
        )
      : null
  );

  savePromises.push(
    saveJson
      ? saveFile(
          jsonFile,
          // Preserve `undefined` values as `null` when stringifying
          JSON.stringify(data, (k, v) => (v === undefined ? null : v), 2),
          overwrite
        )
      : null
  );

  return Promise.all(savePromises);
}

/**
 * Create the report synchronously
 *
 * @param {object} data JSON test data
 * @param {object} opts Report options
 *
 */
function createSync(data, opts) {
  const { html, reportOptions } = prepare(data, opts);
  const { autoOpen, htmlFile } = reportOptions;
  fs.outputFileSync(htmlFile, html);
  if (autoOpen) opener(htmlFile);
}

/**
 * Expose functions
 *
 */
module.exports = { create, createSync };
