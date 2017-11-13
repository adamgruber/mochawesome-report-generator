import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Loader from 'components/report-body/loader';

chai.use(chaiEnzyme());

describe('<Loader />', () => {
  const getInstance = () => {
    const wrapper = shallow(<Loader />);
    return {
      wrapper
    };
  };

  it('renders', () => {
    const { wrapper } = getInstance();
    expect(wrapper.find('.loader-text')).to.have.lengthOf(1);
  });
});
