const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('../package.json');

const env = (!!process.env.BABEL_ENV && process.env.BABEL_ENV) ||
          (!!process.env.NODE_ENV && process.env.NODE_ENV) ||
          'development';

const isDev = env === 'development';
const publicPath = isDev ? 'http://localhost:8080/' : '';
const devtool = isDev ? 'source-map' : '';

const plugins = [
  new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
  new webpack.BannerPlugin(`mochawesome-report-generator ${pkg.version} | https://github.com/adamgruber/mochawesome-report-generator`)
];

if (env === 'production') {
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    output: { inline_script: true }
  }));
}

module.exports = {
  env,
  baseConfig: {
    devtool,
    entry: {
      app: './src/js/mochawesome.js'
    },
    output: {
      path: path.resolve(__dirname, '..', 'dist', 'assets'),
      publicPath,
      filename: '[name].js'
    },
    resolve: {
      extensions: [ '.js', '.json', '.jsx', '.css' ],
      modules: [
        'node_modules',
        'src',
        'components',
        'styles'
      ]
    },
    plugins
  }
};
