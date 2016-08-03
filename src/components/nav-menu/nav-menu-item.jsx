import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);

const NavMenuItem = (props) => {
  const { suite } = props;
  const { rootEmpty, suites, uuid, title, hasTests, hasFailures, hasPending, hasSkipped, hasPasses } = suite;

  const anchorCxName = cx('link', {
    'has-failures': hasTests && hasFailures,
    'has-pending': hasTests && hasPending && !hasFailures,
    'has-skipped': hasTests && hasSkipped && !hasFailures && !hasPending,
    'has-passes': hasTests && hasPasses && !hasFailures && !hasPending && !hasSkipped
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
};

NavMenuItem.propTypes = {
  suite: PropTypes.object
};

export default NavMenuItem;
