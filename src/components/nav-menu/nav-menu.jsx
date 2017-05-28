import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import find from 'lodash/find';
import { Icon, ToggleSwitch, DropdownSelector } from 'components';
import { NavMenuItem } from 'components/nav-menu';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';
import reportStore from '../../js/reportStore';

const cx = classNames.bind(styles);

const NavMenu = props => {
  const { reportTitle, stats, suites, sideNavOpen,
    showPassed, showFailed, showPending, showSkipped, showHooks } = props;
  const { end, passes, failures, pending, skipped } = stats;
  const navItemProps = { showPassed, showFailed, showPending, showSkipped };
  const closeSideNav = () => (reportStore.closeSideNav());
  const reportDate = moment(end).format('dddd, MMMM D YYYY, hh:mma');
  const showHooksOptions = [
    { title: 'Always', value: 'always' },
    { title: 'Never', value: 'never' },
    { title: 'Failed', value: 'failed' }
  ];
  const showHooksSelected = find(showHooksOptions, { value: showHooks });
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
          <ToggleSwitch
            className={ cx('control') }
            label='Show Passed'
            labelClassName={ cx('control-label') }
            icon='check'
            iconClassName={ cx('toggle-icon-passed') }
            active={ showPassed }
            disabled={ passes === 0 }
            toggleFn={ () => (reportStore.toggleFilter('showPassed')) } />
          <ToggleSwitch
            className={ cx('control') }
            label='Show Failed'
            labelClassName={ cx('control-label') }
            icon='close'
            iconClassName={ cx('toggle-icon-failed') }
            active={ showFailed }
            disabled={ failures === 0 }
            toggleFn={ () => (reportStore.toggleFilter('showFailed')) } />
          <ToggleSwitch
            className={ cx('control') }
            label='Show Pending'
            labelClassName={ cx('control-label') }
            icon='pause'
            iconClassName={ cx('toggle-icon-pending') }
            active={ showPending }
            disabled={ pending === 0 }
            toggleFn={ () => (reportStore.toggleFilter('showPending')) } />
          <ToggleSwitch
            className={ cx('control') }
            label='Show Skipped'
            labelClassName={ cx('control-label') }
            icon='stop'
            iconClassName={ cx('toggle-icon-skipped') }
            active={ showSkipped }
            disabled={ skipped === 0 }
            toggleFn={ () => (reportStore.toggleFilter('showSkipped')) } />
          <DropdownSelector
            className={ cx('control') }
            label='Show Hooks'
            labelClassName={ cx('control-label') }
            selected={ showHooksSelected }
            selections={ showHooksOptions }
            onSelect={ item => reportStore.setShowHooks(item.value) } />
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
  showHooks: PropTypes.oneOf([ 'always', 'never', 'failed' ]),
  sideNavOpen: PropTypes.bool
};

NavMenu.displayName = 'NavMenu';

export default NavMenu;
