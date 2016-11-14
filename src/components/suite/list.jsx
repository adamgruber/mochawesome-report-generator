import React, { PropTypes } from 'react';
import Suite from './suite';

const SuiteList = ({ suites, enableChart, enableCode }) => (
  <div>
    { !!suites && suites.map(suite => (
      <Suite
        key={ suite.uuid }
        suite={ suite }
        enableChart={ enableChart }
        enableCode={ enableCode } />
    )) }
  </div>
);

SuiteList.propTypes = {
  suites: PropTypes.array,
  enableChart: PropTypes.bool,
  enableCode: PropTypes.bool
};

SuiteList.displayName = 'SuiteList';

export default SuiteList;
