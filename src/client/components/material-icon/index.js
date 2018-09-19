/* eslint-disable react/no-danger, max-len */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import iconmap from './icon-map.json';

class Icon extends PureComponent {
  render() {
    const { className, name, size, foreground } = this.props;
    const iconCode = iconmap[name];
    const cxName = classNames(
      'material-icons',
      !!size && `md-${size}`,
      !!foreground && `md-${foreground}`,
      className
    );
    return (
      !!iconCode && (
        <i
          className={cxName}
          dangerouslySetInnerHTML={{ __html: `&#x${iconCode};` }}
        />
      )
    );
  }
}

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf([18, 24, 36, 48]),
  foreground: PropTypes.oneOf(['light', 'dark']),
};

Icon.displayName = 'MaterialIcon';

export default Icon;
