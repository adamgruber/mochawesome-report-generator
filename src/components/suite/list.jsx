import React, { PropTypes } from 'react';
import Suite from './suite';

const SuiteList = ({ suites, enableChart }) => (
  <div>
    { !!suites && suites.map(suite => (
      <Suite key={ suite.uuid } suite={ suite } enableChart={ enableChart } />
    )) }
  </div>
);

SuiteList.propTypes = {
  suites: PropTypes.array,
  enableChart: PropTypes.bool
};

SuiteList.displayName = 'SuiteList';

export default SuiteList;
