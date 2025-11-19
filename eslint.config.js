// eslint.config.js
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,

  // React / browser code
  {
    files: ['src/client/**/*.js', 'src/client/**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-transform-private-methods', { loose: true }],
            ['@babel/plugin-transform-private-property-in-object', { loose: true }],
          ],
        },
      },
      globals: {
        chai: true,
        sinon: true,
        window: true,
        document: true,
        console: true,
        setTimeout: true,
        require: true,
      },
    },
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
    },
    rules: {
      'react/require-default-props': 0,
      'import/no-unresolved': 0,
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/forbid-prop-types': 0,
      'import/no-extraneous-dependencies': 0,
      'lines-between-class-members': 0,
      'react/destructuring-assignment': 0,
      'react/default-props-match-prop-types': [0, { allowRequiredDefaults: true }],
      'no-underscore-dangle': 0,
      'jsx-a11y/click-events-have-key-events': 1,
      'jsx-a11y/anchor-is-valid': 1,
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^React$',
          ignoreRestSiblings: true,
        },
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Node CLI/lib code
  {
    files: ['src/bin/**/*.js', 'src/lib/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: true,
        module: true,
        __dirname: true,
        require: true,
        console: true,
      },
    },
    rules: {
      'no-undef': 'off', // silence false positives for Node globals
    },
  },

  // Mocha / test code
  {
    files: ['test/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      globals: {
		// Node globals
		process: true,
        module: true,
        require: true,
        __dirname: true,
		
		// Browser globals
        window: true,
		document: true,
		
		// Mocha globals
		describe: true,
        it: true,
		beforeEach: true,
		afterEach: true,
        before: true,
        after: true,
		
      },
    },
    plugins: {
		react: reactPlugin,
		import: importPlugin
	},
    rules: {
	  'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^React$',
          ignoreRestSiblings: true,
        },
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  }
];
