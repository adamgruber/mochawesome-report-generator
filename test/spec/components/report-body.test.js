import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import Suite from 'components/suite/suite';
import basicSuite from 'sample-data/suite.json';

proxyquire.noCallThru();

chai.use(chaiEnzyme());

const disposerSpy = sinon.spy();
const reactionSpy = sinon.stub().callsFake((fn1, fn2) => {
  fn2();
  return disposerSpy;
});

const ReportBody = proxyquire('components/report-body', {
  mobx: {
    reaction: reactionSpy,
  },
}).default;

describe('<ReportBody />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = shallow(<ReportBody {...instanceProps} />, {
      lifecycleExperimental: true,
    });
    return {
      wrapper: wrapper.dive(),
      suites: wrapper.dive().find(Suite),
    };
  };

  beforeEach(() => {
    props = {
      reportStore: {
        enableCode: true,
        initialLoadTimeout: 0,
        filteredSuites: [basicSuite],
        updateFilteredSuites: () => [basicSuite],
        toggleIsLoading: sinon.spy(),
      },
    };
  });

  it('renders Suites', () => {
    const { suites } = getInstance(props);
    expect(suites).to.have.lengthOf(1);
  });

  it('calls disposer on unmount', () => {
    const { wrapper } = getInstance(props);
    wrapper.unmount();
    expect(disposerSpy.called).to.equal(true);
  });
});
