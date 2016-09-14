import React, { PropTypes } from 'react';
import classNames from 'classnames';
import iconmap from './icon-map';

const Icon = ({ className, name }) => {
  const iconCode = iconmap[name];
  return !!iconCode && <i className={ classNames('material-icons', className) } dangerouslySetInnerHTML={ { __html: `&#x${iconCode};` } } />;
};

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string
};

Icon.displayName = 'MaterialIcon';

export default Icon;
