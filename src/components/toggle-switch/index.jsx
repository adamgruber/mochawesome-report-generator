import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

class ToggleSwitch extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    label: PropTypes.string,
    toggleFn: PropTypes.func.isRequired
  };

  static defaultProps = {
    active: false
  };

  render() {
    return (
      <div>
        <div className={ cx('track') }>
          <span className={ cx('label') }>{ this.props.label }</span>
          <button className={ cx('toggle') } onClick={ this.props.toggleFn }>{ this.props.active ? 'On' : 'Off' }</button>
        </div>
      </div>
    );
  }
}

export default ToggleSwitch;
