import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import { Icon } from 'components';
import { NavMenuList } from 'components/nav-menu';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);

class NavMenuItem extends Component {
  static propTypes = {
    suite: PropTypes.object,
    showPassed: PropTypes.bool,
    showFailed: PropTypes.bool,
    showPending: PropTypes.bool,
    showSkipped: PropTypes.bool
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    const { suite, showPassed, showFailed, showPending, showSkipped } = this.props;
    const { suites, uuid, title, hasTests,
      hasFailures, hasPending, hasSkipped, hasPasses } = suite;
    const navItemProps = { showPassed, showFailed, showPending, showSkipped };

    const fail = hasTests && hasFailures;
    const pend = hasTests && hasPending && !hasFailures;
    const skip = hasTests && hasSkipped && !hasFailures && !hasPending;
    const pass = hasTests && hasPasses && !hasFailures && !hasPending && !hasSkipped;

    const shouldBeDisabled = () => {
      let count = 0;
      if (!hasTests && suites) count += 1;
      if (hasPasses) count += 1;
      if (hasFailures) count += 1;
      if (hasPending) count += 1;
      if (hasSkipped) count += 1;

      if (!showSkipped && hasSkipped) count -= 1;
      if (!showPending && hasPending) count -= 1;
      if (!showFailed && hasFailures) count -= 1;
      if (!showPassed && hasPasses) count -= 1;
      if (!showSkipped && !showPending && !showFailed && !showPassed && !hasTests) count -= 1;

      return count <= 0;
    };

    const anchorCxName = cx('link', {
      disabled: shouldBeDisabled()
    });

    const suiteIcon = () => {
      let iconName;
      let iconClassName;
      if (pass) {
        iconName = 'check';
        iconClassName = 'pass';
      }
      if (skip) {
        iconName = 'stop';
        iconClassName = 'skipped';
      }
      if (pend) {
        iconName = 'pause';
        iconClassName = 'pending';
      }
      if (fail) {
        iconName = 'close';
        iconClassName = 'fail';
      }
      return <Icon name={ iconName } className={ cx('link-icon', iconClassName) } size={ 18 } />;
    };

    const scrollToSuite = (e, suiteId) => {
      e.preventDefault();
      // Find element to scroll to
      const suiteEl = document.getElementById(suiteId);
      // Get its top value
      const top = suiteEl.getBoundingClientRect().top;
      // Get the details container and get its top padding
      const detailsCnt = document.getElementById('details');
      let topPad = window.getComputedStyle(detailsCnt).getPropertyValue('padding-top');
      topPad = parseInt(topPad, 10);
      // Calc the y position to scroll to
      // 4px offset due to shadow
      const scrollY = (document.body.scrollTop + top) - (topPad + 4);
      window.scrollTo(0, scrollY);
    };

    return (
      <li className={ cx('item', { 'has-tests': hasTests }) }>
        <a href={ `#${uuid}` } className={ anchorCxName } onClick={ e => scrollToSuite(e, uuid) }>
          { suiteIcon() }
          <span>{ title === '' ? uuid : title }</span>
        </a>
        { suites && !!suites.length && <NavMenuList suites={ suites } { ...navItemProps } /> }
      </li>
    );
  }
}

export default NavMenuItem;
