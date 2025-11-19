const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const JS_REGEX = /\.js$|\.jsx$/;
const ESLintPlugin = require('eslint-webpack-plugin');
const cssnano = require('cssnano');

// Webpack plugins
const plugins = [
  new ESLintPlugin({
    extensions: ['js', 'jsx'],
    emitWarning: true,
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
];

// Babel loader
function babel(attrs = {}, version) {
  return {
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
    ...attrs,
  };
}

// PostCSS loader helper
function postcss(opts = {}) {
  return {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-import')(),
          require('postcss-url')(),
          require('postcss-extend-rule')(),
          require('postcss-preset-env')({
            stage: 0,
            overrideBrowserslist: ['>0.25%, not ie 11, not op_mini all, not dead'],
          }),
          cssnano(),
          require('postcss-reporter')(),
        ],
      },
      ...opts,
    },
  };
}

// Local CSS (CSS Modules)
function localCss() {
  return {
    test: /\.module\.css$/i,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          esModule: false,
          importLoaders: 1,
          modules: {
            localIdentName: '[local]__[hash:base64:5]',
          },
        },
      },
      postcss(),
    ],
  };
}

// Global CSS (no CSS modules)
function globalCss() {
  return {
    test: /\.css$/i,
    exclude: /\.module\.css$/i,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          esModule: false,
          importLoaders: 1,
          modules: false,
        },
      },
      postcss(),
    ],
  };
}

// Font / asset loader
function font(type, opts = {}) {
  let test;
  switch (type) {
    case 'woff':
    case 'woff2':
      test = /\.(woff2?)(\?v=\d+\.\d+\.\d+)?$/;
      break;
    case 'ttf':
    case 'truetype':
      test = /\.ttf(\?v=\d+\.\d+\.\d+)?$/;
      break;
    case 'svg':
      test = /\.svg(\?v=\d+\.\d+\.\d+)?$/;
      break;
    default:
      throw new Error(`Unsupported font type: ${type}`);
  }

  const isInline = opts.limit && opts.limit > 50000;

  return {
    test,
    type: isInline ? 'asset/inline' : 'asset/resource',
    generator: {
      filename: '[name][ext]',
    },
  };
}

module.exports = {
  plugins,
  ESLintPlugin,
  babel,
  globalCss,
  localCss,
  font,
  postcss,
};
