import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import ReportBody from 'components/report-body';
import Loader from 'components/loader';
import Suite from 'components/suite/suite';
import basicSuite from 'sample-data/suite.json';

chai.use(chaiEnzyme());

describe('<ReportBody />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = shallow(<ReportBody { ...instanceProps } />, {
      lifecycleExperimental: true
    });
    return {
      wrapper: wrapper.dive(),
      loader: wrapper.dive().find(Loader),
      suites: wrapper.dive().find(Suite)
    };
  };

  beforeEach(() => {
    props = {
      reportStore: {
        enableCode: true,
        initialLoadTimeout: 0,
        isLoading: true,
        suites: [ basicSuite ],
        toggleIsLoading: sinon.spy()
      }
    };
  });

  it('renders Loader', () => {
    const { loader } = getInstance(props);
    expect(loader).to.have.lengthOf(1);
  });

  it('renders Suites', () => {
    props.reportStore.isLoading = false;
    const { loader, suites } = getInstance(props);
    expect(loader).to.have.lengthOf(0);
    expect(suites).to.have.lengthOf(1);
  });

  it('calls toggleIsLoading', done => {
    getInstance(props);
    setTimeout(() => {
      expect(props.reportStore.toggleIsLoading.called).to.equal(true);
      done();
    }, props.reportStore.initialLoadTimeout);
  });
});
