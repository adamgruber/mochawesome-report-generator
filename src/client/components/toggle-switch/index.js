import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

function ToggleSwitch(props) {
  const {
    active,
    className,
    disabled,
    labelClassName,
    label,
    icon,
    iconClassName,
    id,
    toggleFn,
  } = props;
  const labelCxName = cx('label', { 'with-icon': !!icon }, labelClassName);
  const onChangeFn = e => !disabled && toggleFn(e);
  return (
    <div className={cx('component', className, { disabled })}>
      {!!icon && <Icon name={icon} className={cx('icon', iconClassName)} />}
      <label className={labelCxName} htmlFor={id}>{label}
        <input
          aria-label={`Toggle status: ${active ? 'on' : 'off'}`}
          type="checkbox"
          id={id}
          className={cx('toggle-input')}
          checked={active}
          disabled={disabled}
          onChange={onChangeFn} />
        <span className={cx('toggle')} />
      </label>
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
  id: PropTypes.string.isRequired,
  toggleFn: PropTypes.func.isRequired,
};

ToggleSwitch.defaultProps = {
  active: false,
};

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;
