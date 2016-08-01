const React = require('react');
const { PropTypes } = React;

function MainHTML(props) {
  const { data, options, scripts, styles } = props;
  const clientScript = options.dev ? 'http://localhost:8080/dist/app.js' : 'app.js';
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Mochawesome Report Card</title>
        { options.inlineAssets
          ? <style dangerouslySetInnerHTML={ { __html: styles } } />
          : <link rel='stylesheet' href='app.css' /> }
      </head>
      <body data-raw={ JSON.stringify(data) } data-config={ JSON.stringify(options) }>
        <div id='report'></div>
        { options.inlineAssets
          ? <script type='text/javascript' dangerouslySetInnerHTML={ { __html: scripts } } />
          : <script src={ clientScript }></script> }
      </body>
    </html>
  );
}

MainHTML.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  scripts: PropTypes.string,
  styles: PropTypes.string
};

module.exports = MainHTML;
