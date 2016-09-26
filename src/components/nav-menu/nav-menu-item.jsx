import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import reportStore from '../../js/reportStore';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);

const NavMenuItem = observer((props) => {
  const { showPassed, showFailed, showPending } = reportStore;
  const { suite } = props;
  const { rootEmpty, suites, uuid, title, hasTests, hasFailures, hasPending, hasSkipped, hasPasses } = suite;

  const anchorCxName = cx('link', {
    'has-failures': hasTests && hasFailures,
    'has-pending': hasTests && hasPending && !hasFailures,
    'has-skipped': hasTests && hasSkipped && !hasFailures && !hasPending,
    'has-passes': hasTests && hasPasses && !hasFailures && !hasPending && !hasSkipped,
    // this is wrong, need much more logic to determine if item should be disabled
    disabled: (hasPasses && !showPassed) || (hasFailures && !showFailed) || (hasPending && !showPending)
  });

  if (rootEmpty) {
    return !!suites && suites.map((subSuite, i) => <NavMenuItem key={ i } suite={ subSuite } />);
  }

  return (
    <li className={ cx('item') }>
      <a href={ `#${uuid}` } className={ anchorCxName }>{ title === '' ? uuid : title }</a>
      { !!suites && suites.map((subSuite, i) => (
        <ul key={ i } className={ cx('list-unstyled', 'sub') }>
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
