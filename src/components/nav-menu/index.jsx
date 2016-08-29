import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { ToggleSwitch } from 'components';
import reportStore from '../../js/reportStore';
import NavMenuItem from './nav-menu-item';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);


const NavMenu = observer(({ suites }) => {
  const closeSideNav = () => (reportStore.closeSideNav());
  const { showPassed, showFailed, showPending } = reportStore;
  return (
    <div className={ cx('wrap', { open: reportStore.sideNavOpen }) }>
      <div onClick={ closeSideNav } className={ cx('overlay') }></div>
      <nav className={ cx('menu') }>
        <button
          onClick={ closeSideNav }
          className={ cx('close-button') }>
          <i className='icon-failed'></i>
        </button>
        <div className={ cx('toggles-wrap') }>
          <ToggleSwitch
            className={ cx('toggle') }
            label='Show Passed'
            active={ showPassed }
            toggleFn={ () => (reportStore.showPassed = !showPassed) } />
          <ToggleSwitch
            className={ cx('toggle') }
            label='Show Failed'
            active={ showFailed }
            toggleFn={ () => (reportStore.showFailed = !showFailed) } />
          <ToggleSwitch
            className={ cx('toggle') }
            label='Show Pending'
            active={ showPending }
            toggleFn={ () => (reportStore.showPending = !showPending) } />
        </div>
        { !!suites && suites.map(suite => (
          <ul key={ suite.uuid } className={ cx('list-unstyled', 'main') }>
            { !!suite.suites && suite.suites.map(subSuite => <NavMenuItem key={ subSuite.uuid } suite={ subSuite } />) }
          </ul>)) }
      </nav>
    </div>
  );
});

NavMenu.propTypes = {
  suites: PropTypes.array
};

NavMenu.displayName = 'NavMenu';

export default NavMenu;
