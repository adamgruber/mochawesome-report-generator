import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { format } from 'date-fns';
import find from 'lodash/find';
import { Icon, ToggleSwitch, DropdownSelector } from 'components';
import { NavMenuItem } from 'components/nav-menu';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);

@inject('reportStore') @observer
class NavMenu extends Component {
  static propTypes = {
    reportStore: PropTypes.shape({
      allSuites: PropTypes.array,
      closeSideNav: PropTypes.func,
      reportTitle: PropTypes.string,
      setShowHooks: PropTypes.func,
      showFailed: PropTypes.bool,
      showHooks: PropTypes.string,
      showHooksOptions: PropTypes.array,
      showPassed: PropTypes.bool,
      showPending: PropTypes.bool,
      showSkipped: PropTypes.bool,
      sideNavOpen: PropTypes.bool,
      stats: PropTypes.object,
      toggleFilter: PropTypes.func
    })
  };

  render() {
    const {
      allSuites,
      closeSideNav,
      reportTitle,
      setShowHooks,
      showFailed,
      showHooks,
      showHooksOptions,
      showPassed,
      showPending,
      showSkipped,
      sideNavOpen,
      stats,
      toggleFilter
    } = this.props.reportStore;

    const navItemProps = {
      showPassed,
      showFailed,
      showPending,
      showSkipped
    };

    const showHooksOpts = showHooksOptions.map(opt => ({
      title: `${opt.charAt(0).toUpperCase()}${opt.slice(1)}`,
      value: opt
    }));

    const showHooksSelected = find(showHooksOpts, { value: showHooks });

    return (
      <div className={ cx('wrap', { open: sideNavOpen }) }>
        <div onClick={ closeSideNav } className={ cx('overlay') } />
        <nav className={ cx('menu') }>
          <button onClick={ closeSideNav } className={ cx('close-btn') }>
            <Icon name='close' />
          </button>
          <div className={ cx('section') }>
            <h3 className={ cx('title') }>{ reportTitle }</h3>
            <h6 className={ cx('date') }>
              { format(stats.end, 'dddd, MMMM D, YYYY h:mma') }
            </h6>
          </div>
          <div className={ cx('section') }>
            <ToggleSwitch
              className={ cx('control') }
              label='Show Passed'
              labelClassName={ cx('control-label') }
              icon='check'
              iconClassName={ cx('toggle-icon-passed') }
              active={ showPassed }
              disabled={ stats.passes === 0 }
              toggleFn={ () => (toggleFilter('showPassed')) } />

            <ToggleSwitch
              className={ cx('control') }
              label='Show Failed'
              labelClassName={ cx('control-label') }
              icon='close'
              iconClassName={ cx('toggle-icon-failed') }
              active={ showFailed }
              disabled={ stats.failures === 0 }
              toggleFn={ () => (toggleFilter('showFailed')) } />

            <ToggleSwitch
              className={ cx('control') }
              label='Show Pending'
              labelClassName={ cx('control-label') }
              icon='pause'
              iconClassName={ cx('toggle-icon-pending') }
              active={ showPending }
              disabled={ stats.pending === 0 }
              toggleFn={ () => (toggleFilter('showPending')) } />

            <ToggleSwitch
              className={ cx('control') }
              label='Show Skipped'
              labelClassName={ cx('control-label') }
              icon='stop'
              iconClassName={ cx('toggle-icon-skipped') }
              active={ showSkipped }
              disabled={ stats.skipped === 0 }
              toggleFn={ () => (toggleFilter('showSkipped')) } />

            <DropdownSelector
              className={ cx('control') }
              label='Show Hooks'
              labelClassName={ cx('control-label') }
              selected={ showHooksSelected }
              selections={ showHooksOpts }
              onSelect={ item => setShowHooks(item.value) } />
          </div>
          <div className={ cx('section') }>
            { !!allSuites && allSuites.map(suite => (
              <ul
                key={ suite.uuid }
                className={ cx('list', 'main', {
                  'no-tests': (!suite.tests || suite.tests.length === 0)
                }) }>
                { !!suite.suites && suite.suites.map(subSuite => (
                  <NavMenuItem key={ subSuite.uuid } suite={ subSuite } { ...navItemProps } />
                )) }
              </ul>)) }
          </div>
        </nav>
      </div>
    );
  }
}

export default NavMenu;
