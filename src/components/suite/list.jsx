import React, { PropTypes } from 'react';
import Suite from './suite';

const SuiteList = ({ suites }) => (
  <div>
    { !!suites && suites.map(suite => <Suite key={ suite.uuid } suite={ suite } />) }
  </div>
);

SuiteList.propTypes = {
  suites: PropTypes.array
};

SuiteList.displayName = 'SuiteList';

export default SuiteList;
