var path = require('path');

var config = {
      splitChar: process.platform === 'win32' ? '\\' : '/',
      reportDir: pj('.', 'mochawesome-reports'),
      reportName: 'mochawesome'
    };

module.exports = function (options) {
  // Base Directories
  config.libDir         = __dirname;
  config.reportDir      = _getOption('reportDir', options);
  config.reportTitle    = _getOption('reportTitle', options);
  config.inlineAssets   = _getOption('inlineAssets', options, true);
  config.autoOpen       = _getOption('autoOpen', options, true);
  config.nodeModulesDir = pj(__dirname, '..', 'node_modules');

  // Build Directories
  config.buildDir       = pj(__dirname, '..', 'dist');
  config.buildFontsDir  = pj(config.buildDir, 'fonts');
  config.buildCssDir    = pj(config.buildDir, 'css');
  config.buildJsDir     = pj(config.buildDir, 'js');

  // Source Directories
  config.srcDir         = pj(__dirname, '..', 'src');
  config.srcFontsDir    = pj(config.srcDir, 'fonts');
  config.srcLessDir     = pj(config.srcDir, 'less');
  config.srcJsDir       = pj(config.srcDir, 'js');
  config.srcHbsDir      = pj(config.srcDir, 'templates');

  // Bootstrap Directories
  config.bsDir          = pj(config.nodeModulesDir, 'bootstrap');
  config.bsFontsDir     = pj(config.bsDir, 'fonts');
  config.bsLessDir      = pj(config.bsDir, 'less');

  // Report Directories
  config.reportJsDir    = pj(config.reportDir, 'js');
  config.reportFontsDir = pj(config.reportDir, 'fonts');
  config.reportCssDir   = pj(config.reportDir, 'css');

  // Report Files
  config.reportJsonFile = pj(config.reportDir, _getOption('reportName', options) + '.json');
  config.reportHtmlFile = pj(config.reportDir, _getOption('reportName', options) + '.html');

  // Client-Side JS Files
  config.clientJsFiles  = [pj(config.srcJsDir, 'mochawesome.js')];

  // Vendor JS Files
  config.vendorJsFiles  = [pj(config.nodeModulesDir, 'jquery', 'dist', 'jquery.js'),
                           pj(config.bsDir, 'js', 'transition.js'),
                           pj(config.bsDir, 'js', 'collapse.js'),
                           pj(config.srcJsDir, 'lodash.custom.js'),
                           pj(config.nodeModulesDir, 'chart.js', 'Chart.js')];

  return config;
};

function pj() {
  return path.join.apply(null, arguments);
}

function _getOption (optToGet, options, isBool) {
  var envVar = 'MOCHAWESOME_' + optToGet.toUpperCase();
  // Order of precedence
  // 1. Config option
  // 2. Environment variable
  // 3. Base config
  if (options && typeof options[optToGet] !== 'undefined') {
    return (isBool && typeof options[optToGet] === 'string') ?
      options[optToGet] === 'true'
      : options[optToGet];
  }
  if (typeof process.env[envVar] !== 'undefined') {
    return (isBool && typeof options[optToGet] === 'string') ?
      process.env[envVar] === 'true'
      : process.env[envVar];
  }
  return (isBool && typeof config[optToGet] === 'string') ?
    config[optToGet] === 'true'
    : config[optToGet];
}