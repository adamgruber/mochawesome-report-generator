import React, { PropTypes } from 'react';
import moment from 'moment';
import { Icon, ToggleSwitch } from 'components';
import { NavMenuItem } from 'components/nav-menu';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';
import reportStore from '../../js/reportStore';

const cx = classNames.bind(styles);

const NavMenu = props => {
  const { reportTitle, stats, suites, sideNavOpen,
    showPassed, showFailed, showPending, showSkipped } = props;
  const { end, passes, failures, pending, skipped } = stats;
  const navItemProps = { showPassed, showFailed, showPending, showSkipped };
  const closeSideNav = () => (reportStore.closeSideNav());
  const reportDate = moment(end).format('dddd, MMMM D YYYY, hh:mma');
  return (
    <div className={ cx('wrap', { open: sideNavOpen }) }>
      <div onClick={ closeSideNav } className={ cx('overlay') } />
      <nav className={ cx('menu') }>
        <button onClick={ closeSideNav } className={ cx('close-btn') }>
          <Icon name='close' />
        </button>
        <div className={ cx('section') }>
          <h3 className={ cx('title') }>{ reportTitle }</h3>
          <h6 className={ cx('date') }>{ reportDate }</h6>
        </div>
        <div className={ cx('section') }>
          { !!passes && <ToggleSwitch
            className={ cx('toggle') }
            label='Show Passed'
            labelClassName={ cx('toggle-label') }
            icon='check'
            iconClassName={ cx('toggle-icon-passed') }
            active={ showPassed }
            toggleFn={ () => (reportStore.toggleFilter('showPassed')) } /> }
          { !!failures && <ToggleSwitch
            className={ cx('toggle') }
            label='Show Failed'
            labelClassName={ cx('toggle-label') }
            icon='close'
            iconClassName={ cx('toggle-icon-failed') }
            active={ showFailed }
            toggleFn={ () => (reportStore.toggleFilter('showFailed')) } /> }
          { !!pending && <ToggleSwitch
            className={ cx('toggle') }
            label='Show Pending'
            labelClassName={ cx('toggle-label') }
            icon='pause'
            iconClassName={ cx('toggle-icon-pending') }
            active={ showPending }
            toggleFn={ () => (reportStore.toggleFilter('showPending')) } /> }
          { !!skipped && <ToggleSwitch
            className={ cx('toggle') }
            label='Show Skipped'
            labelClassName={ cx('toggle-label') }
            icon='stop'
            iconClassName={ cx('toggle-icon-skipped') }
            active={ showSkipped }
            toggleFn={ () => (reportStore.toggleFilter('showSkipped')) } /> }
        </div>
        <div className={ cx('section') }>
          { !!suites && suites.map(suite => (
            <ul
              key={ suite.uuid }
              className={ cx('list', 'main', { 'no-tests': !suite.hasTests }) }>
              { !!suite.suites && suite.suites.map(subSuite => (
                <NavMenuItem key={ subSuite.uuid } suite={ subSuite } { ...navItemProps } />
              )) }
            </ul>)) }
        </div>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  suites: PropTypes.array,
  reportTitle: PropTypes.string,
  stats: PropTypes.object,
  showPassed: PropTypes.bool,
  showFailed: PropTypes.bool,
  showPending: PropTypes.bool,
  showSkipped: PropTypes.bool,
  sideNavOpen: PropTypes.bool
};

NavMenu.displayName = 'NavMenu';

export default NavMenu;
