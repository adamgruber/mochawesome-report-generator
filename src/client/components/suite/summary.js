import React from 'react';
import PropTypes from 'prop-types';
import { Duration, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './suite-summary.css';

const cx = classNames.bind(styles);

const SuiteSummary = props => {
  const {
    className,
    duration,
    totalTests,
    totalPasses,
    totalFailures,
    totalPending,
    totalSkipped,
  } = props;

  return (
    <ul className={cx('component', className)}>
      <li className={cx('summary-item', 'duration')} title="Duration">
        <Icon name="timer" className={cx('icon')} size={18} />
        <Duration timer={duration} />
      </li>
      <li className={cx('summary-item', 'tests')} title="Tests">
        <Icon name="assignment" className={cx('icon')} size={18} />
        {totalTests}
      </li>
      {!!totalPasses && (
        <li className={cx('summary-item', 'passed')} title="Passed">
          <Icon name="check" className={cx('icon')} size={18} />
          {totalPasses}
        </li>
      )}
      {!!totalFailures && (
        <li className={cx('summary-item', 'failed')} title="Failed">
          <Icon name="close" className={cx('icon')} size={18} />
          {totalFailures}
        </li>
      )}
      {!!totalPending && (
        <li className={cx('summary-item', 'pending')} title="Pending">
          <Icon name="pause" className={cx('icon')} size={18} />
          {totalPending}
        </li>
      )}
      {!!totalSkipped && (
        <li className={cx('summary-item', 'skipped')} title="Skipped">
          <Icon name="stop" className={cx('icon')} size={18} />
          {totalSkipped}
        </li>
      )}
    </ul>
  );
};

SuiteSummary.propTypes = {
  className: PropTypes.string,
  duration: PropTypes.number,
  totalTests: PropTypes.number,
  totalPasses: PropTypes.number,
  totalFailures: PropTypes.number,
  totalPending: PropTypes.number,
  totalSkipped: PropTypes.number,
};

SuiteSummary.displayName = 'SuiteSummary';

export default SuiteSummary;
