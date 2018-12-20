import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Main from '../../../src/lib/main-html';

chai.use(chaiEnzyme());

const getInstance = props => shallow(<Main {...props} />);
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
    const wrapper = getInstance(props);
    expect(wrapper.find('link')).to.have.attr('href', 'app.css');
    expect(wrapper.find('script')).to.have.attr('src', 'app.js');
  });

  it('renders scripts/styles inline', () => {
    props.useInlineAssets = true;
    const wrapper = getInstance(props);
    expect(wrapper.find('style').html()).to.equal(
      '<style>body{display:block;}</style>'
    );
    expect(wrapper.find('script').html()).to.equal(
      '<script type="text/javascript">function noop(){return;}</script>'
    );
  });
});
