import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Main from '../../../lib/src/main-html';

chai.use(chaiEnzyme());

const data = JSON.stringify({ testdata: 'test' });
const reportPageTitle = 'test';

describe('<MainHTML />', () => {
  it('sets correct script/style urls', () => {
    const opts = {
      options: {
        reportPageTitle
      }
    };
    const wrapper = shallow(<Main data={ data } { ...opts } />);
    expect(wrapper.find('link')).to.have.attr('href', 'assets/app.css');
    expect(wrapper.find('script')).to.have.attr('src', 'assets/app.js');
  });

  it('sets correct script/style urls for dev', () => {
    const opts = {
      options: {
        reportPageTitle,
        dev: true
      }
    };
    const wrapper = shallow(<Main data={ data } { ...opts } />);
    expect(wrapper.find('link')).to.have.attr('href', 'http://localhost:8080/app.css');
    expect(wrapper.find('script')).to.have.attr('src', 'http://localhost:8080/app.js');
  });

  it('renders scripts/styles inline', () => {
    const opts = {
      options: {
        reportPageTitle,
        inlineAssets: true
      },
      styles: 'body{display:block;}',
      scripts: 'function noop(){return;}'
    };
    const wrapper = shallow(<Main data={ data } { ...opts } />);
    expect(wrapper.find('style')).to.have.html('<style>body{display:block;}</style>');
    expect(wrapper.find('script')).to.have.html(
      '<script type="text/javascript">function noop(){return;}</script>'
    );
  });
});
