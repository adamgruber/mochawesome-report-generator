const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = (!!process.env.BABEL_ENV && process.env.BABEL_ENV) ||
          (!!process.env.NODE_ENV && process.env.NODE_ENV) ||
          'development';

const isDev = env === 'development';
const publicPath = isDev ? 'http://localhost:8080/' : '';
const devtool = isDev ? 'source-map' : '';

const plugins = [
  new ExtractTextPlugin('[name].css', { allChunks: true }),
  new webpack.optimize.OccurrenceOrderPlugin()
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
  devtool,
  env,
  entry: {
    app: './src/js/mochawesome.js'
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'assets'),
    publicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: [ '', '.js', '.json', '.jsx', '.es6', '.babel', '.css', 'less' ],
    modulesDirectories: [
      'node_modules',
      'src',
      'components',
      'styles'
    ]
  },
  plugins,
  postcss: () => [
    require('postcss-import')({
      plugins: [ require('stylelint')() ]
    }),
    require('postcss-url')(),
    require('postcss-cssnext')({
      browsers: [ 'last 2 versions', 'not ie <= 8' ]
    }),
    require('postcss-reporter')()
  ]
};
