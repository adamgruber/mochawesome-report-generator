import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './radio-button.css';

const cx = classNames.bind(styles);

function RadioButton(props) {
  const { active, className, labelClassName, label, icon, iconClassName, onClick } = props;
  const labelCxName = cx('label', { 'with-icon': !!icon }, labelClassName);
  return (
    <div className={ cx('component', className) }>
      { !!icon && <Icon name={ icon } className={ iconClassName } /> }
      { !!label && <span className={ labelCxName }>{ label }</span> }
      <div className={ cx('outer', { off: !active }) } onClick={ onClick }>
        <span className={ cx('inner') } />
      </div>
    </div>
  );
}

RadioButton.propTypes = {
  active: PropTypes.bool.isRequired,
  className: PropTypes.any,
  labelClassName: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

RadioButton.defaultProps = {
  active: false
};

RadioButton.displayName = 'RadioButton';

export default RadioButton;
