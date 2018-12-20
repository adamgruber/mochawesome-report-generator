import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Dropdown from 'components/dropdown';
import DropdownMenu from 'components/dropdown/menu';

chai.use(chaiEnzyme());

describe('<Dropdown />', () => {
  let props;
  let unmountSpy;
  const itemSelectedSpy = sinon.spy();
  const toggleSpy = sinon.spy();

  const getInstance = instanceProps => {
    const wrapper = mount(<Dropdown {...instanceProps} />);
    return {
      wrapper,
      toggle: wrapper.find('.dropdown-toggle'),
      menu: wrapper.find(DropdownMenu),
      items: wrapper.find('.dropdown-list-item-link'),
    };
  };

  beforeEach(() => {
    unmountSpy = sinon.spy(Dropdown.prototype, 'componentWillUnmount');
    props = {
      list: [
        { title: 'Always', value: 'always' },
        { title: 'Never', value: 'never' },
        { title: 'Failed', value: 'failed' },
      ],
      onToggle: toggleSpy,
      onItemSelected: itemSelectedSpy,
    };
  });

  afterEach(() => {
    itemSelectedSpy.resetHistory();
    toggleSpy.resetHistory();
    unmountSpy.restore();
  });

  it('renders a basic dropdown', () => {
    const { menu, toggle, items } = getInstance(props);
    expect(menu).to.have.lengthOf(1);
    expect(menu.hasClass('dropdown-open')).to.equal(false);
    expect(items).to.have.lengthOf(3);
    expect(toggle).to.have.lengthOf(1);
    expect(toggle.text()).to.equal('Please select');
  });

  it('renders a dropdown with icon only', () => {
    const testProps = Object.assign({}, props, { iconOnly: true });
    const { menu, toggle, items } = getInstance(testProps);
    expect(menu).to.have.lengthOf(1);
    expect(menu.hasClass('dropdown-open')).to.equal(false);
    expect(items).to.have.lengthOf(3);
    expect(toggle).to.have.lengthOf(1);
    expect(toggle.text()).to.equal('');
  });

  it('renders a dropdown with options', () => {
    const testProps = Object.assign({}, props, {
      list: [
        { title: 'First', value: 1 },
        { title: 'Second', value: 2 },
        { title: 'Nested', items: [{ title: 'Third', value: 3 }] },
      ],
      showSelected: true,
      selected: { title: 'Failed', value: 'failed' },
      menuAlign: 'right',
      itemRenderFn: item => <div className="custom">{item.title}</div>,
    });
    const { wrapper, menu, toggle, items } = getInstance(testProps);
    expect(menu).to.have.lengthOf(1);
    expect(items).to.have.lengthOf(0);
    expect(wrapper.find('.custom')).to.have.lengthOf(3);
    expect(toggle).to.have.lengthOf(1);
    expect(toggle.text()).to.equal('Failed');
  });

  it('handles toggling the menu', () => {
    const { wrapper, toggle } = getInstance(props);
    toggle.simulate('click');
    expect(wrapper.find('ul').hasClass('dropdown-open')).to.equal(true);
    document.body.click();
    wrapper.update();
    expect(wrapper.find('ul').hasClass('dropdown-open')).to.equal(false);
  });

  it('handles selecting an item', () => {
    const { toggle, items } = getInstance(props);
    toggle.simulate('click');
    items.first().simulate('click');
    expect(itemSelectedSpy.calledOnce).to.equal(true);
  });

  it('removes click events on unmount', () => {
    const { wrapper } = getInstance(props);
    wrapper.unmount();
    expect(unmountSpy.calledOnce).to.equal(true);
  });
});
