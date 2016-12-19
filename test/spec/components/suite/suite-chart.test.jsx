import React from 'react';
import { mount } from 'enzyme';
import proxyquire from 'proxyquire';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

proxyquire.noCallThru();

const SuiteChart = proxyquire('components/suite/chart', {
  'chart.js': () => {}
}).default;

chai.use(chaiEnzyme());

describe('<SuiteChart />', () => {
  let node;

  const getInstance = instanceProps => {
    const wrapper = mount(<SuiteChart { ...instanceProps } />, {
      attachTo: node
    });
    return wrapper;
  };

  beforeEach(() => {
    node = document.createElement('div');
    node.setAttribute('id', 'app');
    document.body.appendChild(node);
  });

  afterEach(() => {
    document.getElementById('app').remove();
  });

  it('renders chart', () => {
    const props = {
      totalPasses: 8,
      totalFailures: 5,
      totalPending: 2,
      totalSkipped: 1
    };
    getInstance(props);
    expect(document.querySelectorAll('canvas').length).to.equal(1);
  });

  it('calls shouldComponentUpdate', () => {
    const props = {
      totalPasses: 8,
      totalFailures: 5,
      totalPending: 2,
      totalSkipped: 1
    };
    const wrapper = getInstance(props);
    sinon.spy(SuiteChart.prototype, 'shouldComponentUpdate');
    wrapper.setProps({
      totalPasses: 9
    });
    expect(SuiteChart.prototype.shouldComponentUpdate.calledOnce).to.equal(true);
  });
});
