/* eslint-disable react/no-danger */
const React = require('react');
const PropTypes = require('prop-types');

function MainHTML(props) {
  const { assetsDir, data, options, scripts, styles } = props;
  const clientScript = options.dev ? 'http://localhost:8080/app.js' : `${assetsDir}/app.js`;
  const clientStyle = options.dev ? 'http://localhost:8080/app.css' : `${assetsDir}/app.css`;
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{ options.reportPageTitle }</title>
        { options.inlineAssets
          ? <style dangerouslySetInnerHTML={ { __html: styles } } />
          : <link rel='stylesheet' href={ clientStyle } /> }
      </head>
      <body data-raw={ data } data-config={ JSON.stringify(options) }>
        <div id='report' />
        { options.inlineAssets
          ? <script type='text/javascript' dangerouslySetInnerHTML={ { __html: scripts } } />
          : <script src={ clientScript } /> }
      </body>
    </html>
  );
}

MainHTML.propTypes = {
  assetsDir: PropTypes.string,
  data: PropTypes.string,
  options: PropTypes.object,
  scripts: PropTypes.string,
  styles: PropTypes.string
};

module.exports = MainHTML;
