import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './suite.css';
import Suite from './suite';

const cx = classNames.bind(styles);

const SuiteList = ({ suites, enableChart, enableCode, main }) => (
  <ul className={cx('list', { 'list-main': main })}>
    {!!suites &&
      suites.map(suite => (
        <Suite
          key={suite.uuid}
          suite={suite}
          enableChart={enableChart}
          enableCode={enableCode}
        />
      ))}
  </ul>
);

SuiteList.propTypes = {
  suites: PropTypes.array,
  enableChart: PropTypes.bool,
  enableCode: PropTypes.bool,
  main: PropTypes.bool,
};

SuiteList.displayName = 'SuiteList';

export default SuiteList;
