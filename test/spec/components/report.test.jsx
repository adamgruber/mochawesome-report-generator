import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Report from 'components/report';
import reportStore from 'js/reportStore';
import testData from 'sample-data/test-data.json';

chai.use(chaiEnzyme());

reportStore.setInitialData({ data: testData, config: {} });

describe('<MochawesomeReport />', () => {
  it('should render', done => {
    sinon.spy(Report.prototype, 'componentDidMount');
    sinon.spy(Report.prototype, 'componentWillUnmount');

    const wrapper = mount(<Report store={ reportStore } />);
    expect(Report.prototype.componentDidMount.calledOnce).to.equal(true);

    setTimeout(() => {
      wrapper.unmount();
      expect(Report.prototype.componentWillUnmount.calledOnce).to.equal(true);
      done();
    }, 0);
  });

  it('should call store actions', () => {
    sinon.spy(reportStore, 'openSideNav');
    sinon.spy(reportStore, 'closeSideNav');
    sinon.spy(reportStore, 'toggleFilter');

    const wrapper = mount(<Report store={ reportStore } />);

    wrapper.find('.open-menu').simulate('click');
    expect(reportStore.openSideNav.calledOnce).to.equal(true);

    wrapper.find('.nav-menu-overlay').simulate('click');
    expect(reportStore.closeSideNav.calledOnce).to.equal(true);

    wrapper.find('.toggle-switch-switch').at(3).simulate('click');
    expect(reportStore.toggleFilter.calledOnce).to.equal(true);
  });
});
