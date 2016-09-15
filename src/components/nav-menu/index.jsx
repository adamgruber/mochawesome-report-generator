import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { ToggleSwitch } from 'components';
import reportStore from '../../js/reportStore';
import NavMenuItem from './nav-menu-item';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);

const NavMenu = observer(({ reportTitle, stats, suites }) => {
  const closeSideNav = () => (reportStore.closeSideNav());
  const reportDate = moment(stats.end).format('dddd, MMMM D YYYY, hh:mma');
  const { showPassed, showFailed, showPending } = reportStore;
  return (
    <div className={ cx('wrap', { open: reportStore.sideNavOpen }) }>
      <div onClick={ closeSideNav } className={ cx('overlay') }></div>
      <nav className={ cx('menu') }>
        <div className={ cx('section', 'toggles-wrap') }>
          <h3 className={ cx('title') }>{ reportTitle }</h3>
          <h6 className={ cx('date') }>{ reportDate }</h6>
        </div>
        <div className={ cx('section', 'toggles-wrap') }>
          <ToggleSwitch
            className={ cx('toggle') }
            label='Show Passed'
            labelClassName={ cx('toggle-label') }
            icon='check'
            iconClassName={ cx('toggle-icon-passed') }
            active={ showPassed }
            toggleFn={ () => (reportStore.showPassed = !showPassed) } />
          <ToggleSwitch
            className={ cx('toggle') }
            label='Show Failed'
            labelClassName={ cx('toggle-label') }
            icon='close'
            iconClassName={ cx('toggle-icon-failed') }
            active={ showFailed }
            toggleFn={ () => (reportStore.showFailed = !showFailed) } />
          <ToggleSwitch
            className={ cx('toggle') }
            label='Show Pending'
            labelClassName={ cx('toggle-label') }
            icon='pause'
            iconClassName={ cx('toggle-icon-pending') }
            active={ showPending }
            toggleFn={ () => (reportStore.showPending = !showPending) } />
        </div>
        <div className={ cx('section', 'toc-wrap') }>
          { !!suites && suites.map(suite => (
            <ul key={ suite.uuid } className={ cx('list-unstyled', 'main') }>
              { !!suite.suites && suite.suites.map(subSuite => <NavMenuItem key={ subSuite.uuid } suite={ subSuite } />) }
            </ul>)) }
        </div>
      </nav>
    </div>
  );
});

NavMenu.propTypes = {
  suites: PropTypes.array
};

NavMenu.displayName = 'NavMenu';

export default NavMenu;
