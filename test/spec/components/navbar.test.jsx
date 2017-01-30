import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import QuickSummary from 'components/quick-summary';
import testData from 'sample-data/test-data.json';

proxyquire.noCallThru();

const openSideNavSpy = sinon.spy();

const Navbar = proxyquire('components/navbar', {
  '../../js/reportStore': {
    openSideNav: openSideNavSpy
  }
}).default;

chai.use(chaiEnzyme());

describe('<Navbar />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = mount(<Navbar { ...instanceProps } />);
    return {
      wrapper,
      title: wrapper.find('.navbar-report-title'),
      infoCnt: wrapper.find('.navbar-report-info-cnt'),
      menuBtn: wrapper.find('.navbar-menu-button'),
      pctBar: wrapper.find('.navbar-pct-bar')
    };
  };

  beforeEach(() => {
    props = {
      qsNodeRef: () => {},
      reportTitle: 'test',
      stats: testData.stats,
      qsWidth: 500,
      mobileBreakpoint: false
    };
  });

  it('renders', () => {
    const { wrapper, title, menuBtn, pctBar, infoCnt } = getInstance(props);
    expect(title.text()).to.equal('test');
    expect(wrapper.find(QuickSummary)).to.have.lengthOf(1);
    expect(menuBtn).to.have.lengthOf(1);
    expect(pctBar.find('span')).to.have.lengthOf(2);
    expect(infoCnt).to.have.style('padding-right', '500px');
  });

  it('renders on mobile', () => {
    props.mobileBreakpoint = true;
    const { infoCnt } = getInstance(props);
    expect(infoCnt).to.not.have.attr('style');
  });

  it('opens side nav', () => {
    const { menuBtn } = getInstance(props);
    menuBtn.simulate('click');
    expect(openSideNavSpy.calledOnce).to.equal(true);
  });
});
