import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import ToggleSwitch from 'components/toggle-switch';

chai.use(chaiEnzyme());

describe('<ToggleSwitch />', () => {
  let props;
  let toggleFn;

  const getInstance = instanceProps => {
    const wrapper = shallow(<ToggleSwitch {...instanceProps} />);
    return {
      wrapper,
      toggle: wrapper.find('.toggle-switch-toggle-input'),
    };
  };

  beforeEach(() => {
    toggleFn = sinon.spy();
    props = { toggleFn, disabled: false, label: 'MyToggle', active: false, icon: 'add' };
  });

  it('renders basic switch (disabled)', () => {
    const { toggle } = getInstance(Object.assign({}, props, { disabled: true }));
    expect(toggle).to.be.disabled();
  });

  it('renders basic switch (off)', () => {
    const { toggle } = getInstance(props);
    expect(toggle).to.not.be.disabled();
    toggle.simulate('change');
    expect(toggleFn.calledOnce).to.equal(true);
  });

  it('renders advanced switch (on)', () => {
    const testProps = Object.assign({}, props, {active: true});
    const { toggle } = getInstance(testProps);
    expect(toggle).to.not.be.disabled();
    expect(toggle).to.not.have.className('toggle-switch-on');
    toggle.simulate('change');
    expect(toggleFn.calledOnce).to.equal(true);
  });
});
