const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

module.exports = {
  devtool: 'source-map',
  env: 'development',
  entry: {
    app: './src/js/mochawesome.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: '[name].js'
    // chunkFilename: '[name]-[hash].js'
  },
  module: {
    preLoaders: [
      { test: JS_REGEX, exclude: /node_modules/, loader: 'eslint' }
    ],
    loaders: [
      { test: JS_REGEX, exclude: /node_modules/, loader: 'babel' },
      { test: /\.global\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?importLoaders=1!postcss-loader') },
      { test: /^((?!\.global).)*\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]--[local]---[hash:base64:5]!postcss-loader') },
      { test: /\.less$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff&name=[name].[ext]' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream&name=[name].[ext]' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=[name].[ext]' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=[name].[ext]' }
    ],
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin('[name].css', { allChunks: true })
    // new webpack.optimize.UglifyJsPlugin({ compress: true })
  ],
  resolve: {
    extensions: [ '', '.js', '.json', '.jsx', '.es6', '.babel', '.css', 'less' ],
    modulesDirectories: [
      'node_modules',
      'src',
      'components',
      'styles'
    ]
  },
  postcss: (wp) => [
    require('postcss-import')({
      addDependencyTo: wp,
      plugins: [ require('stylelint')() ]
    }),
    require('postcss-url')(),
    require('postcss-cssnext')({
      browsers: [ 'last 2 versions', 'not ie <= 8' ]
    }),
    // add additional plugins here
    // require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
};
