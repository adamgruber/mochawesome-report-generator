import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import reportStore from '../../js/reportStore';
import { Icon } from 'components/';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);

const NavMenuItem = observer((props) => {
  const { showPassed, showFailed, showPending, showSkipped } = reportStore;
  const { suite } = props;
  const { rootEmpty, suites, uuid, title,
    hasTests, hasFailures, hasPending, hasSkipped, hasPasses } = suite;

  const fail = hasTests && hasFailures;
  const pend = hasTests && hasPending && !hasFailures;
  const skip = hasTests && hasSkipped && !hasFailures && !hasPending;
  const pass = hasTests && hasPasses && !hasFailures && !hasPending && !hasSkipped;

  const shouldBeDisabled = () => {
    let count = 0;
    if (!hasTests && suites) count++;
    if (hasPasses) count++;
    if (hasFailures) count++;
    if (hasPending) count++;
    if (hasSkipped) count++;

    if (!showSkipped && hasSkipped) count--;
    if (!showPending && hasPending) count--;
    if (!showFailed && hasFailures) count--;
    if (!showPassed && hasPasses) count--;
    if (!showSkipped && !showPending && !showFailed && !showPassed && !hasTests) count--;

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
    const suiteEl = document.getElementById(suiteId);
    const top = suiteEl.getBoundingClientRect().top;
    const scrollY = top - 84;
    console.log(top, scrollY);
    window.scrollTo(0, top - 84);
  };

  if (rootEmpty) {
    return !!suites && suites.map(subSuite => (
      <NavMenuItem key={ subSuite.uuid } suite={ subSuite } />)
    );
  }

  return (
    <li className={ cx('item') }>
      <a href={ `#${uuid}` } className={ anchorCxName } onClick={ (e) => scrollToSuite(e, uuid) }>
        { suiteIcon() }
        { title === '' ? uuid : title }
      </a>
      { !!suites && suites.map(subSuite => (
        <ul key={ subSuite.uuid } className={ cx('list-unstyled', 'sub') }>
          <NavMenuItem suite={ subSuite } />
        </ul>)
      ) }
    </li>
  );
});

NavMenuItem.propTypes = {
  suite: PropTypes.object
};

export default NavMenuItem;
