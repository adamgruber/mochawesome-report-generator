import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Report from 'components/report';
import DevTools from 'mobx-react-devtools';
import { ReportStore } from 'js/reportStore';

import testData from 'sample-data/nested.json';

chai.use(chaiEnzyme());

describe('<MochawesomeReport />', () => {
  let reportStore;
  let props;
  let clock;

  const getInstance = (instanceProps, opts) => {
    const wrapper = mount(<Report { ...instanceProps } />, opts);
    return {
      wrapper,
      toggleSwitches: wrapper.find('.toggle-switch-switch')
    };
  };

  beforeEach(() => {
    reportStore = new ReportStore();
    props = { store: reportStore };
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render', () => {
    reportStore.setInitialData({ data: testData, config: {} });

    const { wrapper } = getInstance(props);
    expect(wrapper.find(DevTools)).to.have.lengthOf(0);
  });

  it('should render in dev mode', () => {
    reportStore.setInitialData({ data: testData, config: { dev: true } });
    const { wrapper } = getInstance(props);
    expect(wrapper.find(DevTools)).to.have.lengthOf(1);
  });

  it('should scroll to a suite', () => {
    reportStore.setInitialData({
      data: testData,
      config: { enableCharts: true }
    });

    const node = document.createElement('div');
    node.setAttribute('id', 'app');
    document.body.appendChild(node);
    const { wrapper } = getInstance(props, { attachTo: node });
    clock.next();

    expect(window.scrollTop).to.equal(0);
    wrapper.find('.nav-menu-link').at(3).simulate('click');
    document.getElementById('app').remove();
  });
});
