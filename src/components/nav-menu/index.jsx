import React, { PropTypes } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import reportStore from '../../js/reportStore';
import NavMenuItem from './nav-menu-item';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);


const NavMenu = observer((props) => {
  const closeSideNav = action('closeSideNav', () => (reportStore.sideNavOpen = false));
  const { suites } = props;
  return (
    <div className={ cx('wrap', { open: reportStore.sideNavOpen }) }>
      <div onClick={ closeSideNav } className={ cx('overlay') }></div>
      <nav className={ cx('menu') }>
        <button
          onClick={ closeSideNav }
          className={ cx('close-button') }>
          <i className='icon-failed'></i>
        </button>
        <ul className={ cx('list-unstyled', 'main') }>
          { suites.suites.map((suite, i) => <NavMenuItem key={ i } suite={ suite } />) }
        </ul>
      </nav>
    </div>
  );
});

NavMenu.propTypes = {
  suites: PropTypes.object
};

NavMenu.displayName = 'NavMenu';

export default NavMenu;
