const path = require('path');
const env = (!!process.env.BABEL_ENV && process.env.BABEL_ENV) ||
          (!!process.env.NODE_ENV && process.env.NODE_ENV) ||
          'development';

const isDev = env === 'development';
const publicPath = isDev ? 'http://localhost:8080/' : '';
const devtool = isDev ? 'source-map' : '';

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
    // chunkFilename: '[name]-[hash].js'
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
