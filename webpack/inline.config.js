/* eslint-disable max-len */
const path = require('path');
const { baseConfig } = require('./base.config');
const loaders = require('./loaders');

// Set output path
baseConfig.output.path = path.resolve(__dirname, '..', 'dist', 'assets', 'inline');

const { eslint, babel, globalCss, localCss, font } = loaders;

module.exports = Object.assign({}, baseConfig, {
  module: {
    rules: [
      eslint({ enforce: 'pre' }),
      babel(),
      globalCss({
        minimize: true,
        importLoaders: 1
      }),
      localCss({
        minimize: true,
        modules: true,
        importLoaders: 1,
        localIdentName: '[name]--[local]---[hash:base64:5]'
      }),
      font('woff', { limit: 100000 }),
      font('ttf', { limit: 100000 }),
      font('svg', { limit: 100000 })
    ]
  }
});
