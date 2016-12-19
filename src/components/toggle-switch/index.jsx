import React, { PropTypes } from 'react';
import { Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

function ToggleSwitch(props) {
  const { active, className, labelClassName, label, icon, iconClassName, toggleFn } = props;
  const labelCxName = cx('label', { 'with-icon': !!icon }, labelClassName);
  return (
    <div className={ cx('component', className) }>
      { !!icon && <Icon name={ icon } className={ iconClassName } /> }
      { !!label && <span className={ labelCxName }>{ label }</span> }
      <div className={ cx('switch', { off: !active }) } onClick={ toggleFn }>
        <span className={ cx('toggle', 'z-depth-1') } />
      </div>
    </div>
  );
}

ToggleSwitch.propTypes = {
  active: PropTypes.bool.isRequired,
  className: PropTypes.any,
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
