import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

// import { NavMenu } from 'components/nav-menu';
import ToggleSwitch from 'components/toggle-switch';
import NavMenuList from 'components/nav-menu/nav-menu-list';
import NavMenuItem from 'components/nav-menu/nav-menu-item';

// import Report from 'components/report';
// import reportStore from 'js/reportStore';
import testData from 'sample-data/test-data.json';

proxyquire.noCallThru();

const closeSideNavSpy = sinon.spy();
const toggleFilterSpy = sinon.spy();

const NavMenuComp = proxyquire('components/nav-menu/nav-menu', {
  '../../js/reportStore': {
    closeSideNav: closeSideNavSpy,
    toggleFilter: toggleFilterSpy
  }
});

const NavMenu = NavMenuComp.default;

// reportStore.setInitialData({ data: testData, config: {} });

chai.use(chaiEnzyme());

describe('<NavMenu />', () => {
  let reportStore;
  let props;

  const getInstance = (props) => {
    const wrapper = mount(<NavMenu { ...props } />);
    return {
      wrapper,
      title: wrapper.find('.title'),
      navList: wrapper.find('.nav-menu-main'),
      toggles: wrapper.find(ToggleSwitch)
    };
  }

  beforeEach(() => {
    props = { 
      suites: [ testData.suites ],
      reportTitle: 'test',
      stats: testData.stats,
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: true,
      sideNavOpen: true
    };
  });

  it('renders with toggles and suites', () => {
    const { wrapper, title, navList, toggles } = getInstance(props);

    expect(title.text()).to.equal('test');
    expect(navList).to.have.lengthOf(1);
    expect(toggles).to.have.lengthOf(4);
  });

  it('renders without toggles or suites', () => {
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
    const { wrapper, title, navList, toggles } = getInstance(newProps);

    expect(title.text()).to.equal('test');
    expect(navList).to.have.lengthOf(0);
    expect(toggles).to.have.lengthOf(0);
  });

  it('calls reportStore functions', () => {
    const { wrapper, toggles } = getInstance(props);
    wrapper.find('.nav-menu-close-btn').simulate('click');
    const switches = toggles.find('.toggle-switch-switch');
    switches.forEach(node => node.simulate('click'));
    expect(closeSideNavSpy.calledOnce).to.equal(true);
    expect(toggleFilterSpy.callCount).to.equal(4);
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
