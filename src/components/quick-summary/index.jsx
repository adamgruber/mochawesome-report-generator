import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Icon } from '../../components';
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
          <Icon name='timer' className={ cx('icon') } />
          { formatSummaryDuration(duration) }
          <span>{ getSummaryDurationUnits(duration) }</span>
        </li>
        <li className={ cx('item', 'suites') } title='Suites'>
          <Icon name='apps' className={ cx('icon') } />{ suites }
        </li>
        <li className={ cx('item', 'tests') } title='Tests'>
          <Icon name='assignment' className={ cx('icon') } />{ testsRegistered }
        </li>
        <li className={ cx('item', 'passes') } title='Passed'>
          <Icon name='check' className={ cx('icon') } />{ passes }
        </li>
        <li className={ cx('item', 'failures') } title='Failed'>
          <Icon name='close' className={ cx('icon') } />{ failures }
        </li>
        <li className={ cx('item', 'pending') } title='Pending'>
          <Icon name='pause' className={ cx('icon') } />{ pending }
        </li>
      </ul>
    </div>
  );
});

QuickSummary.propTypes = {
  stats: PropTypes.object,
  show: PropTypes.bool
};

export default QuickSummary;
