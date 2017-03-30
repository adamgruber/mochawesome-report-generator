#!/usr/bin/env node
const yargs = require('yargs');
const options = require('../lib/options');
const mareport = require('./cli-main');

// Setup yargs
yargs
  .usage('Usage: $0 [data-in-file] [options]')
  .options(options.getYargsOptions())
  .help('help')
  .alias('h', 'help')
  .version()
  .epilog('Copyright 2016-2017 Adam Gruber')
  .argv;

// Call the main cli program
mareport(yargs.argv);
