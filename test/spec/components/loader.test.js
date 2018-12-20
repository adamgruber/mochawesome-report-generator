import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Loader from 'components/loader';

chai.use(chaiEnzyme());

describe('<Loader />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = shallow(<Loader {...instanceProps} />);
    return { wrapper: wrapper.dive() };
  };

  beforeEach(() => {
    props = {
      reportStore: {
        isLoading: true,
      },
    };
  });

  it('renders when isLoading is true', () => {
    const { wrapper } = getInstance(props);
    expect(wrapper.find('.loader-text')).to.have.lengthOf(1);
  });

  it('does NOT render when isLoading is true', () => {
    props.reportStore.isLoading = false;
    const { wrapper } = getInstance(props);
    expect(wrapper.isEmptyRender()).to.equal(true);
  });
});
