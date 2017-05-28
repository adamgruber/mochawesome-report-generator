import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './dropdown-selector.css';

const cx = classNames.bind(styles);

const toggleIcon = () => (
  <Icon name='arrow_drop_down' size={ 18 } className={ cx('toggle-icon') } />
);

function DropdownSelector(props) {
  const { className, labelClassName, label, icon, iconClassName, onSelect, selections, selected,
  ddClassName, ddMenuClassName, ddSelectedClassName } = props;
  const labelCxName = cx('label', { 'with-icon': !!icon }, labelClassName);
  return (
    <div className={ cx('component', className) }>
      { !!icon && <Icon name={ icon } className={ cx('icon', iconClassName) } /> }
      { !!label && <span className={ labelCxName }>{ label }</span> }
      <Dropdown
        className={ cx('dropdown', ddClassName) }
        menuClassName={ cx('menu', ddMenuClassName) }
        selectedClassName={ cx('item-selected', ddSelectedClassName) }
        toggleClassName={ cx('toggle') }
        itemClassName={ cx('item') }
        linkClassName={ cx('item-link') }
        showSelected
        list={ selections }
        selected={ selected }
        onItemSelected={ onSelect }
        toggleIcon={ toggleIcon } />
    </div>
  );
}

DropdownSelector.propTypes = {
  className: PropTypes.any,
  ddClassName: PropTypes.any,
  ddMenuClassName: PropTypes.any,
  ddSelectedClassName: PropTypes.any,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  label: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.object,
  selections: PropTypes.array.isRequired
};

DropdownSelector.displayName = 'DropdownSelector';

export default DropdownSelector;
