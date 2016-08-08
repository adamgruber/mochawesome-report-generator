import React, { PropTypes } from 'react';
import { formatDuration } from '../../utils';
import classNames from 'classnames/bind';
import styles from './suite.css';

const cx = classNames.bind(styles);

const SuiteSummary = (props) => {
  const { duration, totalTests, totalPasses, totalFailures, totalPending } = props;

  return (
    <ul className={ cx('summary') }>
      <li className={ cx('summary-item', 'duration') }>{ formatDuration(duration) }</li>
      <li className={ cx('summary-item', 'tests') }>{ totalTests }</li>
      <li className={ cx('summary-item', 'passed') }>{ totalPasses }</li>
      <li className={ cx('summary-item', 'failed') }>{ totalFailures }</li>
      <li className={ cx('summary-item', 'pending') }>{ totalPending }</li>
    </ul>
  );
};

SuiteSummary.propTypes = {
  duration: PropTypes.number,
  totalTests: PropTypes.number,
  totalPasses: PropTypes.number,
  totalFailures: PropTypes.number,
  totalPending: PropTypes.number
};

SuiteSummary.displayName = 'SuiteSummary';

export default SuiteSummary;
