import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import reportStore from '../../js/reportStore';
import { formatSummaryDuration, getSummaryDurationUnits } from '../../utils';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

const QuickSummary = observer(({ stats }) => {
  const { duration, suites, testsRegistered, passes, failures, pending } = stats;
  return (
    <div className={ cx('cnt', { show: reportStore.showQuickSummary }) }>
      <ul className={ cx('list-unstyled', 'list') }>
        <li className={ cx('item', 'duration') } title='Duration'>
          { formatSummaryDuration(duration) }
          <span>{ getSummaryDurationUnits(duration) }</span>
        </li>
        <li className={ cx('item', 'suites') } title='Suites'>{ suites }</li>
        <li className={ cx('item', 'tests') } title='Tests'>{ testsRegistered }</li>
        <li className={ cx('item', 'passes') } title='Passed'>{ passes }</li>
        <li className={ cx('item', 'failures') } title='Failed'>{ failures }</li>
        <li className={ cx('item', 'pending') } title='Pending'>{ pending }</li>
      </ul>
    </div>
  );
});

QuickSummary.propTypes = {
  stats: PropTypes.object,
  show: PropTypes.bool
};

export default QuickSummary;
