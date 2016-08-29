import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

class ToggleSwitch extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.any,
    label: PropTypes.string,
    toggleFn: PropTypes.func.isRequired
  };

  static defaultProps = {
    active: false
  };

  render() {
    const { active, className, label, toggleFn } = this.props;
    return (
      <div className={ cx('component', className) }>
        <label className={ cx('label') }>{ label }</label>
        <div className={ cx('switch', { off: !active }) } onClick={ toggleFn }>
          <span className={ cx('toggle') }></span>
        </div>
      </div>
    );
  }
}

export default ToggleSwitch;
