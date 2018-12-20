import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import SuiteList from 'components/suite/list';
import Suite from 'components/suite/suite';

import { nested as testData } from 'fixtures/reports';

chai.use(chaiEnzyme());

describe('<SuiteList />', () => {
  const getInstance = instanceProps => {
    const wrapper = shallow(<SuiteList {...instanceProps} />);
    return {
      wrapper,
      suites: wrapper.find(Suite),
    };
  };

  it('renders suite list', () => {
    const { suites } = getInstance({
      suites: testData.results[0].suites[0].suites[0].suites,
    });
    expect(suites).to.have.lengthOf(3);
  });
});
