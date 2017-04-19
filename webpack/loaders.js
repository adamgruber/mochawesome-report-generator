const ExtractTextPlugin = require('extract-text-webpack-plugin');

const JS_REGEX = /\.js$|\.jsx$/;

function eslint(attrs) {
  return Object.assign({
    test: JS_REGEX,
    exclude: /node_modules/,
    use: [ 'eslint-loader' ]
  }, attrs);
}

function babel(attrs) {
  return Object.assign({
    test: JS_REGEX,
    exclude: /node_modules/,
    use: [ 'babel-loader' ]
  }, attrs);
}

function css(options) {
  return {
    loader: 'css-loader',
    options
  };
}

function postcss(opts) {
  return {
    loader: 'postcss-loader',
    options: Object.assign({
      plugins: () => [
        require('postcss-import')(),
        require('postcss-url')(),
        require('postcss-cssnext')({
          browsers: [ 'last 2 versions', 'not ie <= 8' ]
        }),
        require('postcss-reporter')()
      ]
    }, opts)
  };
}

function globalCss(opts) {
  return {
    test: /\.global\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        css(opts),
        postcss()
      ]
    })
  };
}

function localCss(opts) {
  return {
    test: /^((?!\.global).)*\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        css(opts),
        postcss()
      ]
    })
  };
}

function url(options) {
  return {
    loader: 'url-loader',
    options
  };
}

function font(type, opts) {
  let test;
  let mimetype;
  switch (type) {
  case 'woff':
  case 'woff2':
    test = /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/;
    mimetype = 'application/font-woff';
    break;
  case 'ttf':
  case 'truetype':
    test = /\.ttf(\?v=\d+\.\d+\.\d+)?$/;
    mimetype = 'application/octet-stream';
    break;
  case 'svg':
    test = /\.svg(\?v=\d+\.\d+\.\d+)?$/;
    mimetype = 'image/svg+xml';
    break;
  default:
    // nothing
  }
  return {
    test,
    use: [ url(Object.assign({
      mimetype,
      name: '[name].[ext]'
    }, opts)) ]
  };
}

module.exports = {
  eslint,
  babel,
  globalCss,
  localCss,
  font
};
