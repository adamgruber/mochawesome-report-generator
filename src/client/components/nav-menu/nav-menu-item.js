import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
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
    showFlaky: PropTypes.bool,
    showPending: PropTypes.bool,
    showSkipped: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    const {
      suite,
      showPassed,
      showFailed,
      showFlaky,
      showPending,
      showSkipped,
    } = this.props;
    const { suites, uuid, title } = suite;
    const navItemProps = { showPassed, showFailed, showFlaky, showPending, showSkipped };

    const hasTests = !isEmpty(suite.tests);
    const hasPasses = !isEmpty(suite.passes);
    const hasFailures = !isEmpty(suite.failures);
    const hasPending = !isEmpty(suite.pending);
    const hasSkipped = !isEmpty(suite.skipped);
    const hasFlaky = !isEmpty(suite.flaky);

    const fail = hasTests && hasFailures;
    const flaky = hasTests && hasFlaky;
    const pend = hasTests && hasPending && !hasFailures;
    const skip = hasTests && hasSkipped && !hasFailures && !hasPending;
    const pass =
      hasTests && hasPasses && !hasFailures && !hasPending && !hasSkipped;

    const shouldBeDisabled = () => {
      let count = 0;
      if (!hasTests && suites) count += 1;
      if (hasPasses) count += 1;
      if (hasFailures) count += 1;
      if (hasPending) count += 1;
      if (hasSkipped) count += 1;
      if (hasFlaky) count += 1;

      if (!showSkipped && hasSkipped) count -= 1;
      if (!showPending && hasPending) count -= 1;
      if (!showFailed && hasFailures) count -= 1;
      if (!showFlaky && hasFlaky) count -= 1;
      if (!showPassed && hasPasses) count -= 1;
      if (
        !showSkipped &&
        !showPending &&
        !showFailed &&
        !showPassed &&
        !hasTests
      )
        count -= 1;

      return count <= 0;
    };

    const anchorCxName = cx('link', {
      disabled: shouldBeDisabled(),
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
      if (flaky) {
        iconName = 'warning';
        iconClassName = 'flaky';
      }
      return (
        <Icon
          name={iconName}
          className={cx('link-icon', iconClassName)}
          size={18}
        />
      );
    };

    const scrollToSuite = (e, suiteId) => {
      e.preventDefault();
      // Find element to scroll to
      const suiteEl = document.getElementById(suiteId);
      // Get its top value
      const { top } = suiteEl.getBoundingClientRect();
      // Get the details container and get its top padding
      const detailsCnt = document.getElementById('details');
      let topPad = window
        .getComputedStyle(detailsCnt)
        .getPropertyValue('padding-top');
      topPad = parseInt(topPad, 10);
      // Calc the y position to scroll to
      // 4px offset due to shadow
      const scrollY = document.body.scrollTop + top - (topPad + 4);
      window.scrollTo(0, scrollY);
    };

    return (
      <li className={cx('item', { 'has-tests': hasTests })}>
        <a
          href={`#${uuid}`}
          className={anchorCxName}
          onClick={e => scrollToSuite(e, uuid)}
          tabIndex={shouldBeDisabled() ? -1 : 0}>
          {suiteIcon()}
          <span>{title === '' ? uuid : title}</span>
        </a>
        {suites &&
          !!suites.length && <NavMenuList suites={suites} {...navItemProps} />}
      </li>
    );
  }
}

export default NavMenuItem;
