'use strict';

/* eslint-disable react/no-danger */
var React = require('react');
var PropTypes = require('prop-types');

function MainHTML(props) {
  var data = props.data,
      options = props.options,
      scripts = props.scripts,
      styles = props.styles;

  var clientScript = options.dev ? 'http://localhost:8080/app.js' : 'assets/app.js';
  var clientStyle = options.dev ? 'http://localhost:8080/app.css' : 'assets/app.css';
  return React.createElement(
    'html',
    { lang: 'en' },
    React.createElement(
      'head',
      null,
      React.createElement('meta', { charSet: 'utf-8' }),
      React.createElement('meta', { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' }),
      React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      React.createElement(
        'title',
        null,
        options.reportPageTitle
      ),
      options.inlineAssets ? React.createElement('style', { dangerouslySetInnerHTML: { __html: styles } }) : React.createElement('link', { rel: 'stylesheet', href: clientStyle })
    ),
    React.createElement(
      'body',
      { 'data-raw': data, 'data-config': JSON.stringify(options) },
      React.createElement('div', { id: 'report' }),
      options.inlineAssets ? React.createElement('script', { type: 'text/javascript', dangerouslySetInnerHTML: { __html: scripts } }) : React.createElement('script', { src: clientScript })
    )
  );
}

MainHTML.propTypes = {
  data: PropTypes.string,
  options: PropTypes.object,
  scripts: PropTypes.string,
  styles: PropTypes.string
};

module.exports = MainHTML;