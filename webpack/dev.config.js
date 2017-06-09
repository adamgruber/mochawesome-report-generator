/* eslint-disable max-len */
const { baseConfig } = require('./base.config');
const loaders = require('./loaders');

const { eslint, babel, globalCss, localCss, font } = loaders;

module.exports = Object.assign({}, baseConfig, {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  module: {
    rules: [
      eslint({ enforce: 'pre' }),
      babel(),
      globalCss({
        minimize: false,
        importLoaders: 1,
        sourceMap: true
      }),
      localCss({
        minimize: false,
        modules: true,
        importLoaders: 1,
        localIdentName: '[name]--[local]',
        sourceMap: true
      }),
      font('woff', { limit: 1000 }),
      font('ttf', { limit: 1000 })
    ]
  }
});
