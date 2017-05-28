import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

function ToggleSwitch(props) {
  const { active, className, disabled, labelClassName, label, icon, iconClassName, toggleFn } = props;
  const labelCxName = cx('label', { 'with-icon': !!icon }, labelClassName);
  const onClickFn = e => (!disabled && toggleFn(e));
  return (
    <div className={ cx('component', className, { disabled }) }>
      { !!icon && <Icon name={ icon } className={ cx('icon', iconClassName) } /> }
      { !!label && <span className={ labelCxName }>{ label }</span> }
      <div className={ cx('switch', { off: !active }) } onClick={ onClickFn }>
        <span className={ cx('toggle', 'z-depth-1') } />
      </div>
    </div>
  );
}

ToggleSwitch.propTypes = {
  active: PropTypes.bool.isRequired,
  className: PropTypes.any,
  disabled: PropTypes.bool.isRequired,
  labelClassName: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  toggleFn: PropTypes.func.isRequired
};

ToggleSwitch.defaultProps = {
  active: false
};

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;
