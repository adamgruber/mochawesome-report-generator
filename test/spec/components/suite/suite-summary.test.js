import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import SuiteSummary from 'components/suite/summary';

chai.use(chaiEnzyme());

describe('<SuiteSummary />', () => {
  const getInstance = instanceProps => {
    const wrapper = shallow(<SuiteSummary {...instanceProps} />);
    return {
      wrapper,
      items: wrapper.find('.suite-summary-summary-item'),
    };
  };

  it('renders summary', () => {
    const props = {
      duration: 12,
      totalTests: 4,
      totalPasses: 1,
      totalFailures: 1,
      totalPending: 1,
      totalSkipped: 1,
    };
    const { items } = getInstance(props);
    expect(items).to.have.lengthOf(6);
  });

  it('renders summary without test counts', () => {
    const props = {
      duration: 12,
      totalTests: 0,
    };
    const { items } = getInstance(props);
    expect(items).to.have.lengthOf(2);
  });
});
