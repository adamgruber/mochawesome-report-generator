const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const JS_REGEX = /\.js$|\.jsx$/;

function eslint(attrs) {
  return Object.assign(
    {
      test: JS_REGEX,
      exclude: /node_modules/,
      use: ['eslint-loader'],
    },
    attrs
  );
}

function babel(attrs, version) {
  return Object.assign(
    {
      test: JS_REGEX,
      exclude: /node_modules/,
      use: [
        { loader: 'babel-loader' },
        {
          loader: 'string-replace-loader',
          options: {
            search: '__VERSION__',
            replace: version,
          },
        },
      ],
    },
    attrs
  );
}

function css(options) {
  return {
    loader: 'css-loader',
    options,
  };
}

function postcss(opts) {
  return {
    loader: 'postcss-loader',
    options: Object.assign(
      {
        plugins: () => [
          require('postcss-import')(),
          require('postcss-url')(),
          require('postcss-extend-rule')(),
          require('postcss-preset-env')({
            stage: 0,
            browsers: ['>0.25%, not ie 11, not op_mini all, not dead'],
          }),
          require('cssnano')(),
          require('postcss-reporter')(),
        ],
      },
      opts
    ),
  };
}

function globalCss(opts) {
  return {
    test: /\.global\.css$/,
    use: [{ loader: MiniCssExtractPlugin.loader }, css(opts), postcss()],
  };
}

function localCss(opts) {
  return {
    test: /^((?!\.global).)*\.css$/,
    use: [{ loader: MiniCssExtractPlugin.loader }, css(opts), postcss()],
  };
}

function url(options) {
  return {
    loader: 'url-loader',
    options,
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
    use: [
      url(
        Object.assign(
          {
            mimetype,
            name: '[name].[ext]',
          },
          opts
        )
      ),
    ],
  };
}

module.exports = {
  eslint,
  babel,
  globalCss,
  localCss,
  font,
};
