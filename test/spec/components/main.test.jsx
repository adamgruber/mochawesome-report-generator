import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Main from '../../../lib/src/main-html';

chai.use(chaiEnzyme());

const getInstance = props => shallow(<Main { ...props } />);
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
      useInlineAssets: false
    };
  });

  it('sets correct script/style urls', () => {
    const wrapper = getInstance(props);
    expect(wrapper.find('link')).to.have.attr('href', 'app.css');
    expect(wrapper.find('script')).to.have.attr('src', 'app.js');
  });

  it('renders scripts/styles inline', () => {
    props.useInlineAssets = true;
    const wrapper = getInstance(props);
    expect(wrapper.find('style'))
      .to.have.html('<style>body{display:block;}</style>');
    expect(wrapper.find('script'))
      .to.have.html('<script type="text/javascript">function noop(){return;}</script>');
  });
});
