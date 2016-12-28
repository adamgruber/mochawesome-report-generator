#!/usr/bin/env node
'use strict';

var path = require('path');
var yargs = require('yargs');
var mareport = require('./cli-main');

/* Required Args
 * @argument {string} test-data Data to use for rendering report
 */

/* Report Options
 * @property {string}  reportFilename   Filename of report (default: mochawesome)
 * @property {string}  reportDir        Path to save report to (default: cwd/mochawesome-report)
 * @property {string}  reportTitle      Title to use on the report (default: mochawesome)
 * @property {string}  reportPageTitle  Title of the report document (default: mochawesome-report)
 * @property {boolean} inlineAssets     Should assets be inlined into HTML file (default: false)
 * @property {boolean} charts           Should charts be enabled (default: true)
 * @property {boolean} code             Should test code output be enabled (default: true)
 * @property {boolean} dev              Enable dev mode in the report,
 *                                      asssets loaded via webpack (default: false)
 */

// Setup yargs
yargs.usage('Usage: $0 [data-in-file] [options]').options({
  f: {
    alias: ['reportFilename'],
    default: 'mochawesome',
    describe: 'Filename of saved report',
    string: true,
    requiresArg: true
  },
  o: {
    alias: ['reportDir'],
    default: path.join(process.cwd(), 'mochawesome-report'),
    describe: 'Path to save report',
    string: true,
    normalize: true,
    requiresArg: true
  },
  t: {
    alias: ['reportTitle'],
    default: 'mochawesome',
    describe: 'Report title',
    string: true,
    requiresArg: true
  },
  p: {
    alias: ['reportPageTitle'],
    default: 'mochawesome-report',
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
  dev: {
    default: false,
    describe: 'Enable dev mode',
    boolean: true
  }
}).help('help').alias('h', 'help').epilog('Copyright 2016 Adam Gruber').argv;

// Call the main cli program
mareport(yargs.argv);