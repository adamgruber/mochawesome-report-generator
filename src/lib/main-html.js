const escapeHtml = require('escape-html');

/**
 * Escape entities for use in HTML
 *
 * @param {string} str Input string
 *
 * @return {string}
 */
function e(str) {
  return escapeHtml(str).replace(/&#39;/g, '&#x27;')
}

/**
 * Render the main report HTML to a string
 *
 * @param {object} props Report properties
 * @param {string} data Raw report data
 * @param {string} inlineScripts App JS
 * @param {string} inlineStyles App CSS
 * @param {object} options App options
 * @param {string} scriptsUrl URL for app JS
 * @param {string} stylesUrl URL for app CSS
 * @param {string} title Report page title
 * @param {boolean} useInlineAssets Whether to render JS/CSS inline
 *
 * @return {string}
 */

function renderMainHTML(props) {
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

  const styles = useInlineAssets
    ? `<style>${inlineStyles}</style>`
    : `<link rel="stylesheet" href="${stylesUrl}"/>`;

  const scripts = useInlineAssets
    ? `<script type="text/javascript">${inlineScripts}</script>`
    : `<script src="${scriptsUrl}"></script>`;

  const meta =
    '<meta charSet="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1"/>';

  const head = `<head>${meta}<title>${e(title)}</title>${styles}</head>`;

  const body = `<body data-raw="${e(data)}" data-config="${e(
    JSON.stringify(options)
  )}"><div id="report"></div>${scripts}</body>`;

  return `<html lang="en">${head}${body}</html>`;
}

module.exports = renderMainHTML;
