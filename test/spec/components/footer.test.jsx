import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Footer from 'components/footer';

chai.use(chaiEnzyme());

describe('<Footer />', () => {
  it('should render', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('.footer-component')).to.have.lengthOf(1);
  });
});
