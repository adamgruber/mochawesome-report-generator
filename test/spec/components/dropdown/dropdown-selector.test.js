import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import DropdownSelector from 'components/dropdown-selector';
import { Dropdown, Icon } from 'components';

chai.use(chaiEnzyme());

describe('<DropdownSelector />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = shallow(<DropdownSelector {...instanceProps} />);
    return {
      wrapper,
      label: wrapper.find('.label'),
      icon: wrapper.find(Icon),
      dropdown: wrapper.find(Dropdown),
    };
  };

  beforeEach(() => {
    props = {
      onSelect: () => {},
      selected: { title: 'Failed', value: 'failed' },
      selections: [
        { title: 'Always', value: 'always' },
        { title: 'Never', value: 'never' },
        { title: 'Failed', value: 'failed' },
      ],
      label: 'Show Hooks',
    };
  });

  it('should render', () => {
    const { label, icon, dropdown } = getInstance(props);
    expect(label).to.have.lengthOf(1);
    expect(icon).to.have.lengthOf(0);
    expect(label.text()).to.equal('Show Hooks');
    expect(dropdown).to.have.lengthOf(1);
  });

  it('should render with icon', () => {
    const testProps = Object.assign({}, props, { icon: 'settings' });
    const { label, icon, dropdown } = getInstance(testProps);
    expect(label).to.have.lengthOf(1);
    expect(icon).to.have.lengthOf(1);
    expect(label.text()).to.equal('Show Hooks');
    expect(dropdown).to.have.lengthOf(1);
  });
});
