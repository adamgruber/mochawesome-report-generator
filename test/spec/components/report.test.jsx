import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Report from 'components/report';
import DevTools from 'mobx-react-devtools';

import testData from 'sample-data/nested.json';
import { createStore } from 'utils';

chai.use(chaiEnzyme());

describe('<MochawesomeReport />', () => {
  let store;
  let clock;

  const getInstance = (instanceProps, opts) => {
    const wrapper = mount(<Report { ...instanceProps } />, opts);
    return {
      wrapper,
      toggleSwitches: wrapper.find('.toggle-switch-switch')
    };
  };

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render', () => {
    store = createStore(testData);
    const { wrapper } = getInstance({ store });
    expect(wrapper.find(DevTools)).to.have.lengthOf(0);
  });

  it('should render in dev mode', () => {
    store = createStore(testData, { dev: true });
    const { wrapper } = getInstance({ store });
    expect(wrapper.find(DevTools)).to.have.lengthOf(1);
  });

  it('should scroll to a suite', () => {
    store = createStore(testData, { enableCharts: true });

    const node = document.createElement('div');
    node.setAttribute('id', 'app');
    document.body.appendChild(node);
    const { wrapper } = getInstance({ store }, { attachTo: node });
    clock.next();

    expect(window.scrollTop).to.equal(0);
    wrapper.find('.nav-menu-link').at(3).simulate('click');
    document.getElementById('app').remove();
  });
});
