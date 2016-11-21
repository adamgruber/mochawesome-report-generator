const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const env = (!!process.env.BABEL_ENV && process.env.BABEL_ENV) ||
          (!!process.env.NODE_ENV && process.env.NODE_ENV) ||
          'development';

const isDev = env === 'development';
const devtool = isDev ? 'source-map' : '';
const JS_REGEX = /\.js$|\.jsx$/;

const plugins = [ new webpack.optimize.OccurrenceOrderPlugin() ];

if (env === 'production') {
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }));
}

// We don't want to include any node_modules
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => [ '.bin' ].indexOf(x) === -1)
  .forEach(mod => (nodeModules[mod] = `commonjs ${mod}`));

module.exports = {
  devtool,
  env,
  entry: './lib/main.js',
  target: 'node',
  node: {
    __filename: false,
    __dirname: false
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs'
  },
  externals: nodeModules,
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  module: {
    preLoaders: [
      { test: JS_REGEX, exclude: /node_modules/, loader: 'eslint' }
    ],
    loaders: [ {
      test: JS_REGEX,
      exclude: /node_modules/,
      loader: 'babel'
    } ]
  },
  plugins
};
