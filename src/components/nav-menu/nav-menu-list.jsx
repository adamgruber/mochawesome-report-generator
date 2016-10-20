import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import { NavMenuItem } from 'components/nav-menu';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);

class NavMenuList extends Component {
  static propTypes = {
    suites: PropTypes.array,
    showPassed: PropTypes.bool,
    showFailed: PropTypes.bool,
    showPending: PropTypes.bool,
    showSkipped: PropTypes.bool
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    const { suites, showPassed, showFailed, showPending, showSkipped } = this.props;
    const navItemProps = { showPassed, showFailed, showPending, showSkipped };

    return !!suites && (
      <div>
        { suites.map(subSuite => (
          <ul key={ subSuite.uuid } className={ cx('list', 'sub') }>
            <NavMenuItem suite={ subSuite } { ...navItemProps } />
          </ul>)
        ) }
      </div>
    );
  }
}

export default NavMenuList;
