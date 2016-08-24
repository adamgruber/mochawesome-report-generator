import React from 'react';
import { Dropdown } from 'components/';
import reportStore from '../../js/reportStore';
// import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './filter-menu.css';

const cx = classNames.bind(styles);


const FilterMenu = () => {
  const onClickFn = () => {
    // do something
  };

  return (
    <div className={ cx('component') } role='navigation'>
      <Dropdown
        menuClassName={ cx('dropdown-menu') }
        menuAlign='right'
        list={ reportStore.filterDropdownList }
        toggleElement={ <i className='icon-filter'></i> }
        toggleClassName={ cx('toggle') }
        onToggle={ onClickFn } />
    </div>
  );
};

// FilterMenu.propTypes = {};

FilterMenu.displayName = 'FilterMenu';

export default FilterMenu;
