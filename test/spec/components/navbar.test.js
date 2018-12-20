import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import QuickSummary from 'components/quick-summary';
import Navbar from 'components/navbar';
import testData from 'sample-data/test.json';

chai.use(chaiEnzyme());

describe('<Navbar />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = mount(<Navbar {...instanceProps} />);
    return {
      wrapper,
      title: wrapper.find('.navbar-report-title'),
      menuBtn: wrapper.find('.navbar-menu-button'),
      pctBar: wrapper.find('.navbar-pct-bar'),
    };
  };

  beforeEach(() => {
    props = {
      onMenuClick: sinon.spy(),
      reportTitle: 'test',
      stats: testData.stats,
    };
  });

  it('renders', () => {
    const { wrapper, title, menuBtn, pctBar } = getInstance(props);
    expect(title.text()).to.equal('test');
    expect(wrapper.find(QuickSummary)).to.have.lengthOf(1);
    expect(menuBtn).to.have.lengthOf(1);
    expect(pctBar.find('span')).to.have.lengthOf(2);
  });

  it('opens side nav', () => {
    const { menuBtn } = getInstance(props);
    menuBtn.simulate('click');
    expect(props.onMenuClick.calledOnce).to.equal(true);
  });

  describe('when pendingPercent is 100', () => {
    beforeEach(() => {
      props = {
        reportTitle: 'test',
        stats: { passPercent: 0, pendingPercent: 100 },
      };
    });

    it('renders only one percent bar', () => {
      const { pctBar } = getInstance(props);
      expect(pctBar).to.have.lengthOf(1);
      expect(pctBar.find('.navbar-pend')).to.have.lengthOf(1);
    });
  });

  describe('when passPercent and pendingPercent are null', () => {
    beforeEach(() => {
      props = {
        reportTitle: 'test',
        stats: { passPercent: null, pendingPercent: null },
      };
    });

    it('does not render percent bar', () => {
      const { pctBar } = getInstance(props);
      expect(pctBar).to.have.lengthOf(0);
    });
  });
});
