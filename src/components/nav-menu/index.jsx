import React, { PropTypes } from 'react';
import NavMenuItem from './nav-menu-item';
import classNames from 'classnames/bind';
import styles from './nav-menu.css';

const cx = classNames.bind(styles);

const NavMenu = (props) => {
  const { suites } = props;
  console.log(suites);
  return (
    <div className={ cx('wrap') }>
      <div className={ cx('overlay', 'close-menu') }></div>
      <nav className={ cx('menu') }>
        <button className={ cx('button', 'close-button', 'close-menu') }><i className='icon-failed'></i></button>
        <ul className={ cx('list-unstyled', 'main') }>
          { suites.suites.map((suite, i) => <NavMenuItem key={ i } suite={ suite } />) }
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  suites: PropTypes.object
};

export default NavMenu;
