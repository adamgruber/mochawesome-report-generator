import React, { PropTypes } from 'react';
import Test from 'components/test';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const TestList = (props) => {
  const { className, uuid, tests } = props;

  return (
    <div
      id={ `${uuid}-test-list` }
      className={ cx(className) }>
      { !!tests && tests.map(test => <Test key={ test.uuid } test={ test } />) }
    </div>
  );
};

TestList.propTypes = {
  className: PropTypes.string,
  uuid: PropTypes.string,
  tests: PropTypes.object
};

TestList.displayName = 'TestList';

export default TestList;
