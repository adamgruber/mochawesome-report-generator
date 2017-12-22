import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Main from '../../../lib/src/main-html';

chai.use(chaiEnzyme());

const data = JSON.stringify({ testdata: 'test' });

const getInstance = props => shallow(<Main data={ data } { ...props } />);

describe('<MainHTML />', () => {
  let options;
  let props;

  beforeEach(() => {
    options = {
      reportPageTitle: 'test'
    };
    props = {
      assetsDir: 'test/assets',
      options
    };
  });

  it('sets correct script/style urls', () => {
    const wrapper = getInstance(props);
    expect(wrapper.find('link')).to.have.attr('href', 'test/assets/app.css');
    expect(wrapper.find('script')).to.have.attr('src', 'test/assets/app.js');
  });

  it('sets correct script/style urls for dev', () => {
    props.options.dev = true;
    const wrapper = getInstance(props);
    expect(wrapper.find('link')).to.have.attr('href', 'http://localhost:8080/app.css');
    expect(wrapper.find('script')).to.have.attr('src', 'http://localhost:8080/app.js');
  });

  it('renders scripts/styles inline', () => {
    const newProps = { ...props,
      options: { ...options, inlineAssets: true },
      styles: 'body{display:block;}',
      scripts: 'function noop(){return;}'
    };
    const wrapper = getInstance(newProps);
    expect(wrapper.find('style'))
      .to.have.html('<style>body{display:block;}</style>');
    expect(wrapper.find('script'))
      .to.have.html('<script type="text/javascript">function noop(){return;}</script>');
  });
});
