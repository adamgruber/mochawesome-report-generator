import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import NavMenuItem from 'components/nav-menu/nav-menu-item';
import NavMenuList from 'components/nav-menu/nav-menu-list';

import basicSuite from 'sample-data/suite-nested.json';

chai.use(chaiEnzyme());

describe('<NavMenuItem />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = mount(<NavMenuItem { ...instanceProps } />);
    return {
      wrapper,
      links: wrapper.find('.nav-menu-link span'),
      navList: wrapper.find(NavMenuList)
    };
  };

  beforeEach(() => {
    props = {
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: true
    };
  });

  it('should render', () => {
    const testProps = Object.assign({}, props, {
      suite: basicSuite
    });
    const { links, navList } = getInstance(testProps);
    expect(navList).to.have.lengthOf(1);
    expect(links).to.have.lengthOf(3);
    expect(links.first().text()).to.equal('Test Suite - Nested Suites');
  });

  it('should render uuid as title when suite title is empty', () => {
    const newSuite = Object.assign({}, basicSuite, {
      title: ''
    });
    const testProps = Object.assign({}, props, {
      suite: newSuite
    });
    const { links, navList } = getInstance(testProps);
    expect(navList).to.have.lengthOf(1);
    expect(links).to.have.lengthOf(3);
    expect(links.first().text()).to.equal('730ccc57-dac2-4361-a3f4-0edc739c5285');
  });
});
