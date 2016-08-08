import React, { PropTypes } from 'react';
import Suite from './suite';

const SuiteList = (props) => {
  const { suites } = props;
  return (
    <div>
      { !!suites && suites.map(suite => <Suite key={ suite.uuid } suite={ suite } />) }
    </div>
  );
};

SuiteList.propTypes = {
  suites: PropTypes.object
};

SuiteList.displayName = 'SuiteList';

export default SuiteList;
