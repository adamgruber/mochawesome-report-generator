/* eslint-disable react/no-danger, max-len */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import iconmap from './icon-map.json';

const Icon = ({ className, name, size, foreground }) => {
  const iconCode = iconmap[name];
  const cxName = classNames(
    'material-icons',
    !!size && `md-${size}`,
    !!foreground && `md-${foreground}`,
    className
  );
  return !!iconCode && <i className={ cxName } dangerouslySetInnerHTML={ { __html: `&#x${iconCode};` } } />;
};

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf([ 18, 24, 36, 48 ]),
  foreground: PropTypes.oneOf([ 'light', 'dark' ])
};

Icon.displayName = 'MaterialIcon';

export default Icon;
