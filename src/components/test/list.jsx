import React, { PropTypes } from 'react';
import { Test } from 'components/test';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const TestList = ({ className, tests, enableCode }) => (
  <div className={ cx(className) }>
    { !!tests && tests.map(test => (
      <Test key={ test.uuid } test={ test } enableCode={ enableCode } />)
    ) }
  </div>
);

TestList.propTypes = {
  className: PropTypes.string,
  tests: PropTypes.array,
  enableCode: PropTypes.bool
};

TestList.displayName = 'TestList';

export default TestList;
