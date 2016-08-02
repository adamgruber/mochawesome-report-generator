import React, { PropTypes } from 'react';
import { formatSummaryDuration, getSummaryDurationUnits } from '../../utils';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

const QuickSummary = (props) => {
  const { stats } = props;
  const { duration, suites, testsRegistered, passes, failures, pending } = stats;
  return (
    <div className={ cx('cnt') }>
      <ul className={ cx('list-unstyled', 'list') }>
        <li className={ cx('item', 'duration') } title='Duration'>{ formatSummaryDuration(duration) }<span>{ getSummaryDurationUnits(duration) }</span></li>
        <li className={ cx('item', 'suites') } title='Suites'>{ suites }</li>
        <li className={ cx('item', 'tests') } title='Tests'>{ testsRegistered }</li>
        <li className={ cx('item', 'passes') } title='Passed' data-filter='passed'>{ passes }</li>
        <li className={ cx('item', 'failures') } title='Failed' data-filter='failed'>{ failures }</li>
        <li className={ cx('item', 'pending') } title='Pending' data-filter='pending'>{ pending }</li>
      </ul>
    </div>
  );
};

QuickSummary.propTypes = {
  stats: PropTypes.object
};

export default QuickSummary;
