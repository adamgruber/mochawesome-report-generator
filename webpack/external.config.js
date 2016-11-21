/* eslint-disable max-len */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./base.config');

const JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

// Set output path
baseConfig.output.path = path.resolve(__dirname, '..', 'dist', 'assets', 'external');

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
      test: /\.less$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=1000&mimetype=application/font-woff&name=[name].[ext]'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=1000&mimetype=application/octet-stream&name=[name].[ext]'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=1000&mimetype=image/svg+xml&name=[name].[ext]'
    } ]
  }
});
