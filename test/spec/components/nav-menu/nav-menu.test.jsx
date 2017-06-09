import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import ToggleSwitch from 'components/toggle-switch';
import DropdownSelector from 'components/dropdown-selector';
import NavMenuList from 'components/nav-menu/nav-menu-list';

import testData from 'sample-data/hooks.json';

proxyquire.noCallThru();

const closeSideNavSpy = sinon.spy();
const toggleFilterSpy = sinon.spy();
const setShowHooksSpy = sinon.spy();

const NavMenu = proxyquire('components/nav-menu/nav-menu', {
  '../../js/reportStore': {
    closeSideNav: closeSideNavSpy,
    toggleFilter: toggleFilterSpy,
    setShowHooks: setShowHooksSpy
  }
}).default;

chai.use(chaiEnzyme());

describe('<NavMenu />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = mount(<NavMenu { ...instanceProps } />);
    return {
      wrapper,
      title: wrapper.find('.title'),
      navList: wrapper.find('.nav-menu-main'),
      toggles: wrapper.find(ToggleSwitch),
      hooksDropdown: wrapper.find(DropdownSelector)
    };
  };

  beforeEach(() => {
    props = {
      suites: [ testData.suites ],
      reportTitle: 'test',
      stats: testData.stats,
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: true,
      showHooks: 'failed',
      sideNavOpen: true
    };
  });

  it('renders with toggles', () => {
    const { title, navList, toggles, hooksDropdown } = getInstance(props);
    expect(title.text()).to.equal('test');
    expect(navList).to.have.lengthOf(1);
    expect(toggles).to.have.lengthOf(4);
    expect(toggles.find('.toggle-switch-disabled')).to.have.lengthOf(0);
    expect(hooksDropdown).to.have.lengthOf(1);
  });

  it('renders with disabled toggles', () => {
    const newStats = Object.assign({}, props.stats, {
      passes: 0,
      failures: 0,
      pending: 0,
      skipped: 0
    });
    const newProps = Object.assign({}, props, {
      suites: null,
      stats: newStats
    });
    const { title, navList, toggles, hooksDropdown } = getInstance(newProps);

    expect(title.text()).to.equal('test');
    expect(navList).to.have.lengthOf(0);
    expect(toggles).to.have.lengthOf(4);
    expect(toggles.find('.toggle-switch-disabled')).to.have.lengthOf(4);
    expect(hooksDropdown).to.have.lengthOf(1);
  });

  describe('reportStore functions', () => {
    it('closes menu', () => {
      const { wrapper } = getInstance(props);
      wrapper.find('.nav-menu-close-btn').simulate('click');
      expect(closeSideNavSpy.calledOnce).to.equal(true);
    });

    it('clicks toggles', () => {
      const { toggles } = getInstance(props);
      const switches = toggles.find('.toggle-switch-switch');
      switches.forEach(node => node.simulate('click'));
      expect(toggleFilterSpy.callCount).to.equal(4);
    });

    it('sets hooks dropdown', () => {
      const { hooksDropdown } = getInstance(props);
      hooksDropdown.find('button').simulate('click');
      hooksDropdown.find('a').first().simulate('click');
      expect(setShowHooksSpy.calledOnce).to.equal(true);
    });
  });

  it('updates the list', () => {
    const { wrapper } = getInstance(props);
    sinon.spy(NavMenuList.prototype, 'shouldComponentUpdate');
    wrapper.setProps({
      showPassed: false,
      showFailed: false,
      showPending: false,
      showSkipped: false
    });
    expect(NavMenuList.prototype.shouldComponentUpdate.alwaysReturned(true)).to.equal(true);
  });
});
