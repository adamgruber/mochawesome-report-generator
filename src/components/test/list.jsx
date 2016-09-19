import React, { PropTypes } from 'react';
import Test from './test';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const TestList = ({ className, tests }) => (
  <div className={ cx(className) }>
    { !!tests && tests.map(test => <Test key={ test.uuid } test={ test } />) }
  </div>
);

TestList.propTypes = {
  className: PropTypes.string,
  tests: PropTypes.array
};

TestList.displayName = 'TestList';

export default TestList;
