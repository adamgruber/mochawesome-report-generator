import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import ToggleSwitch from 'components/toggle-switch';
import Icon from 'components/material-icon';

chai.use(chaiEnzyme());

describe('<ToggleSwitch />', () => {
  let props;
  let toggleFn;

  const getInstance = instanceProps => {
    const wrapper = shallow(<ToggleSwitch { ...instanceProps } />);
    return {
      wrapper,
      icon: wrapper.find(Icon),
      label: wrapper.find('.toggle-switch-label'),
      toggle: wrapper.find('.toggle-switch-switch')
    };
  };

  beforeEach(() => {
    toggleFn = sinon.spy();
    props = { toggleFn };
  });

  it('renders basic switch (off, no label)', () => {
    const { icon, label, toggle } = getInstance(props);

    expect(icon).to.have.lengthOf(0);
    expect(label).to.have.lengthOf(0);
    expect(toggle).to.have.className('toggle-switch-off');
    toggle.simulate('click');
    expect(toggleFn.calledOnce).to.equal(true);
  });

  it('renders advanced switch (on, label, icon)', () => {
    const testProps = Object.assign({}, props, {
      active: true,
      label: 'test',
      icon: 'add'
    });
    const { icon, label, toggle } = getInstance(testProps);

    expect(icon).to.have.lengthOf(1);
    expect(label).to.have.lengthOf(1);
    expect(toggle).to.not.have.className('toggle-switch-on');
    toggle.simulate('click');
    expect(toggleFn.calledOnce).to.equal(true);
  });
});
