/* eslint-disable react/no-danger */
const React = require('react');
const PropTypes = require('prop-types');

function MainHTML(props) {
  const {
    data,
    inlineScripts,
    inlineStyles,
    options,
    scriptsUrl,
    stylesUrl,
    title,
    useInlineAssets,
  } = props;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        {useInlineAssets ? (
          <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
        ) : (
          <link rel="stylesheet" href={stylesUrl} />
        )}
      </head>
      <body data-raw={data} data-config={JSON.stringify(options)}>
        <div id="report" />
        {useInlineAssets ? (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: inlineScripts }}
          />
        ) : (
          <script src={scriptsUrl} />
        )}
      </body>
    </html>
  );
}

MainHTML.propTypes = {
  data: PropTypes.string,
  inlineScripts: PropTypes.string,
  inlineStyles: PropTypes.string,
  options: PropTypes.object,
  scriptsUrl: PropTypes.string,
  stylesUrl: PropTypes.string,
  title: PropTypes.string,
  useInlineAssets: PropTypes.bool,
};

module.exports = MainHTML;
