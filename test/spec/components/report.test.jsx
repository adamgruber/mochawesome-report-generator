import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Report from 'components/report';
import DevTools from 'mobx-react-devtools';
import reportStore from 'js/reportStore';

import testData from 'sample-data/test-data.json';

chai.use(chaiEnzyme());

describe('<MochawesomeReport />', () => {
  it('should render', done => {
    reportStore.setInitialData({ data: testData, config: {} });
    sinon.spy(Report.prototype, 'componentDidMount');
    sinon.spy(Report.prototype, 'componentWillUnmount');

    const wrapper = mount(<Report store={ reportStore } />);
    expect(wrapper.find(DevTools)).to.have.lengthOf(0);
    expect(Report.prototype.componentDidMount.calledOnce).to.equal(true);

    setTimeout(() => {
      wrapper.unmount();
      expect(Report.prototype.componentWillUnmount.calledOnce).to.equal(true);
      done();
    }, 0);
  });

  it('should render in dev mode', () => {
    reportStore.setInitialData({ data: testData, config: { dev: true } });
    const wrapper = mount(<Report store={ reportStore } />);
    expect(wrapper.find(DevTools)).to.have.lengthOf(1);
  });

  it('should call store actions', () => {
    reportStore.setInitialData({ data: testData, config: {} });
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

  it('should scroll to a suite', () => {
    reportStore.setInitialData({ data: testData, config: {} });
    const node = document.createElement('div');
    node.setAttribute('id', 'app');
    document.body.appendChild(node);
    const wrapper = mount(<Report store={ reportStore } />, {
      attachTo: node
    });
    expect(window.scrollTop).to.equal(0);
    wrapper.find('.nav-menu-link').last().simulate('click');

    document.getElementById('app').remove();
  });
});
