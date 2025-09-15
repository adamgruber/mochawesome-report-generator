const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const loaders = require('./webpack.loaders');
const pkg = require('./package.json');

const { eslint, babel, globalCss, localCss, font } = loaders;

const env =
  (!!process.env.BABEL_ENV && process.env.BABEL_ENV) ||
  (!!process.env.NODE_ENV && process.env.NODE_ENV) ||
  'development';

console.log(`NODE_ENV set to: ${env}`);

let assets = process.env.MARGE_ASSETS;
if (assets !== 'inline' && assets !== 'external') {
  assets = 'external';
}

const isDev = env === 'development';
const fontLimit = assets === 'external' ? 1000 : 100000;
const cssFilename = assets === 'inline' ? '[name].inline.css' : '[name].css';

const plugins = [
  new StyleLintPlugin({
    context: 'src',
    files: '**/*.css',
    color: true,
    emitErrors: false,
  }),
  new MiniCssExtractPlugin({ filename: cssFilename, allChunks: true }),
  new webpack.BannerPlugin(
    `mochawesome-report-generator ${
      pkg.version
    } | https://github.com/adamgruber/mochawesome-report-generator`
  ),
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),
];

module.exports = {
  mode: env,
  devServer: {
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  devtool: isDev ? 'source-map' : false,
  entry: {
    app: './src/client/js/mochawesome.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: isDev ? 'http://localhost:8080/' : '',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css'],
    modules: ['node_modules', 'src', 'src/client', 'styles'],
  },
  module: {
    rules: [
      eslint({ enforce: 'pre' }),
      babel({}, pkg.version),
      globalCss({
        importLoaders: 1,
        sourceMap: isDev,
      }),
      localCss({
        modules: true,
        importLoaders: 1,
        localIdentName: isDev
          ? '[name]--[local]'
          : '[name]--[local]---[hash:base64:5]',
        sourceMap: isDev,
      }),
      font('woff', { limit: fontLimit }),
      font('ttf', { limit: fontLimit }),
      font('svg', { limit: fontLimit }),
    ],
  },
  optimization: {
    minimize: env === 'production',
    minimizer: [
      new TerserPlugin({
        extractComments: {
          banner: () =>
            `mochawesome-report-generator ${
              pkg.version
            } | https://github.com/adamgruber/mochawesome-report-generator`,
        },
      }),
    ],
  },
  plugins,
};
