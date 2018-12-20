import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import MaterialIcon from 'components/material-icon';

chai.use(chaiEnzyme());

describe('<MaterialIcon />', () => {
  it('renders basic icon', () => {
    const wrapper = shallow(<MaterialIcon name="add" />);
    expect(wrapper.html()).to.equal('<i class="material-icons">&#xe145;</i>');
  });

  it('renders icon with options', () => {
    const opts = {
      size: 18,
      foreground: 'dark',
      className: 'icontest',
    };
    const wrapper = shallow(<MaterialIcon name="add" {...opts} />);
    expect(wrapper.html()).to.equal(
      '<i class="material-icons md-18 md-dark icontest">&#xe145;</i>'
    );
  });

  it('does not render when name is not provided', () => {
    const wrapper = shallow(<MaterialIcon />);
    expect(wrapper).to.be.blank();
  });
});
