import React, { PropTypes } from 'react';
import Suite from './suite';

const SuiteList = ({ suites, showChart }) => (
  <div>
    { !!suites && suites.map(suite => (
      <Suite key={ suite.uuid } suite={ suite } showChart={ showChart } />
    )) }
  </div>
);

SuiteList.propTypes = {
  suites: PropTypes.array,
  showChart: PropTypes.bool
};

SuiteList.displayName = 'SuiteList';

export default SuiteList;
