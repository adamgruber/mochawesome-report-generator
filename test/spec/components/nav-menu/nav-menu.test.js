import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import ToggleSwitch from 'components/toggle-switch';
import DropdownSelector from 'components/dropdown-selector';
import NavMenuList from 'components/nav-menu/nav-menu-list';
import NavMenu from 'components/nav-menu/nav-menu';

// import testData from 'sample-data/hooks.json';
import { hooks as testData } from 'fixtures/reports';

import { createStore } from 'utils';

chai.use(chaiEnzyme());

describe('<NavMenu />', () => {
  let props;
  let store;
  let listenerMap;

  const getInstance = instanceProps => {
    const wrapper = mount(<NavMenu {...instanceProps} />);
    return {
      wrapper,
      title: wrapper.find('.title'),
      navList: wrapper.find('.nav-menu-main'),
      toggles: wrapper.find(ToggleSwitch),
      hooksDropdown: wrapper.find(DropdownSelector),
    };
  };

  beforeEach(() => {
    store = createStore({
      reportTitle: 'test',
      stats: testData.stats,
      results: testData.results,
    });

    props = {
      reportStore: store,
    };

    listenerMap = {};
    sinon.stub(document, 'addEventListener').callsFake((event, cb) => {
      listenerMap[event] = cb;
    });
  });

  afterEach(() => {
    document.addEventListener.restore();
  });

  it('renders with toggles', () => {
    store.openSideNav();
    const { title, navList, toggles, hooksDropdown } = getInstance(props);
    expect(title.text()).to.equal('test');
    expect(navList).to.have.lengthOf(1);
    expect(toggles).to.have.lengthOf(4);
    expect(toggles.find('.toggle-switch-disabled')).to.have.lengthOf(0);
    expect(hooksDropdown).to.have.lengthOf(1);
  });

  it('renders with disabled toggles', () => {
    props.reportStore = createStore({
      reportTitle: 'test',
      stats: {
        passes: 0,
        failures: 0,
        pending: 0,
        skipped: 0,
      },
    });

    store.openSideNav();
    const { title, navList, toggles, hooksDropdown } = getInstance(props);
    expect(title.text()).to.equal('test');
    expect(navList).to.have.lengthOf(0);
    expect(toggles).to.have.lengthOf(4);
    expect(toggles.find('.toggle-switch-disabled')).to.have.lengthOf(4);
    expect(hooksDropdown).to.have.lengthOf(1);
  });

  describe('reportStore functions', () => {
    beforeEach(() => {
      sinon.spy(store, 'closeSideNav');
      sinon.spy(store, 'toggleFilter');
      sinon.spy(store, 'setShowHooks');
    });

    it('closes menu', () => {
      store.openSideNav();
      const { wrapper } = getInstance(props);
      wrapper.find('.nav-menu-close-btn').simulate('click');
      expect(store.closeSideNav.calledOnce).to.equal(true);
    });

    it('closes menu on escape press', () => {
      store.openSideNav();
      getInstance(props);
      listenerMap.keydown({ key: 'Escape' });
      expect(store.closeSideNav.calledOnce).to.equal(true);
    });

    it('clicks toggles', () => {
      store.openSideNav();
      const { toggles } = getInstance(props);
      const switches = toggles.find('.toggle-switch-toggle-input');
      switches.forEach(node => node.simulate('change'));
      expect(store.toggleFilter.callCount).to.equal(4);
    });

    it('sets hooks dropdown', () => {
      store.openSideNav();
      const { hooksDropdown } = getInstance(props);
      hooksDropdown.find('button').first().simulate('click');
      hooksDropdown
        .find('button')
        .at(2)
        .simulate('click');
      expect(store.setShowHooks.calledOnce).to.equal(true);
    });
  });

  it('updates the list', () => {
    getInstance(props);
    sinon.spy(NavMenuList.prototype, 'shouldComponentUpdate');
    store.toggleFilter('showPassed');
    store.toggleFilter('showFailed');
    store.toggleFilter('showPending');
    store.toggleFilter('showSkipped');
    expect(
      NavMenuList.prototype.shouldComponentUpdate.alwaysReturned(true)
    ).to.equal(true);
  });

  it('unmounts properly', () => {
    store.openSideNav();
    const { wrapper } = getInstance(props);
    const disposerSpy = sinon.spy(wrapper.instance().wrappedInstance, 'disposer');
    wrapper.unmount();
    expect(disposerSpy.calledOnce).to.equal(true)
  });
});
