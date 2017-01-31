import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './suite.css';
import Suite from './suite';

const cx = classNames.bind(styles);

const SuiteList = ({ suites, enableChart, enableCode, main }) => (
  <div className={ cx({ 'list-main': main }) }>
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
  enableCode: PropTypes.bool,
  main: PropTypes.bool
};

SuiteList.displayName = 'SuiteList';

export default SuiteList;
