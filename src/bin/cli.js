#!/usr/bin/env node
/* eslint-disable no-unused-expressions */
const yargs = require('yargs');
const { yargsOptions } = require('../lib/options');
const marge = require('./cli-main');

const argv = yargs
  .usage('Usage: $0 [options] <data_file> [data_file2..]')
  .demand(1)
  .options(yargsOptions)
  .help('help')
  .alias('h', 'help')
  .version()
  .parserConfiguration({
    'camel-case-expansion': false,
    'strip-aliased': true,
  })
  .epilog(`Copyright ${new Date().getFullYear()} Adam Gruber`)
  .parse();

// Call the main cli program
marge(argv);
