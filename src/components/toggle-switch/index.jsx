import React, { Component, PropTypes } from 'react';
import { Icon } from '../../components';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

class ToggleSwitch extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.any,
    labelClassName: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    iconClassName: PropTypes.string,
    toggleFn: PropTypes.func.isRequired
  };

  static defaultProps = {
    active: false
  };

  render() {
    const { active, className, labelClassName, label, icon, iconClassName, toggleFn } = this.props;
    return (
      <div className={ cx('component', className) }>
        { !!icon && <Icon name={ icon } className={ iconClassName } /> }
        <label className={ cx('label', { 'with-icon': !!icon }, labelClassName) }>{ label }</label>
        <div className={ cx('switch', { off: !active }) } onClick={ toggleFn }>
          <span className={ cx('toggle', 'z-depth-1') }></span>
        </div>
      </div>
    );
  }
}

export default ToggleSwitch;
