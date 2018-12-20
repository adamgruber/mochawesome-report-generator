import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Report from 'components/report';
import MobxDevTool from 'components/mobxDevtool';

import { nested as testData } from 'fixtures/reports';
import { createStore } from 'utils';

chai.use(chaiEnzyme());

describe('<MochawesomeReport />', () => {
  let store;

  const getInstance = (instanceProps, opts) => {
    const wrapper = mount(<Report {...instanceProps} />, opts);
    return {
      wrapper,
      toggleSwitches: wrapper.find('.toggle-switch-switch'),
    };
  };

  it('should render', () => {
    store = createStore(testData);
    const { wrapper } = getInstance({ store });
    expect(wrapper.find(MobxDevTool)).to.have.lengthOf(0);
  });

  it('should render dev tool', () => {
    store = createStore(testData, { dev: true });
    const { wrapper } = getInstance({ store });
    expect(wrapper.find(MobxDevTool)).to.have.lengthOf(1);
  });
});
