import { expect } from 'chai';
import renderMainHTML from '../../../src/lib/main-html';

const getInstance = props => {
  const rendered = renderMainHTML(props);
  document.write(rendered);
  return rendered;
}

let props;

describe('<MainHTML />', () => {
  beforeEach(() => {
    props = {
      data: '',
      inlineScripts: 'function noop(){return;}',
      inlineStyles: 'body{display:block;}',
      options: {},
      scriptsUrl: 'app.js',
      stylesUrl: 'app.css',
      title: 'test',
      useInlineAssets: false,
    };
  });

  it('sets correct script/style urls', () => {
    getInstance(props);
    const linkEl = document.head.querySelector('link');
    const scriptEl = document.body.querySelector('script');
    expect(linkEl.getAttribute('href')).to.equal('app.css');
    expect(scriptEl.getAttribute('src')).to.equal('app.js');
  });

  it('renders scripts/styles inline', () => {
    props.useInlineAssets = true;
    getInstance(props);
    const styleEl = document.head.querySelector('style');
    expect(styleEl.outerHTML).to.equal(
      '<style>body{display:block;}</style>'
    );
    const scriptEl = document.body.querySelector('script');

    expect(scriptEl.outerHTML).to.equal(
      '<script type="text/javascript">function noop(){return;}</script>'
    );
  });
});
