/* eslint-disable max-len */
const baseConfig = require('./base.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

module.exports = Object.assign({}, baseConfig, {
  module: {
    preLoaders: [
      { test: JS_REGEX, exclude: /node_modules/, loader: 'eslint' }
    ],
    loaders: [ {
      test: JS_REGEX,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.global\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize&importLoaders=1!postcss-loader')
    }, {
      test: /^((?!\.global).)*\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize&modules&importLoaders=1&localIdentName=[name]--[local]---[hash:base64:5]!postcss-loader')
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=1000&mimetype=application/font-woff&name=[name].[ext]'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=1000&mimetype=application/octet-stream&name=[name].[ext]'
    } ]
  }
});
