import React, { PropTypes } from 'react';
import { Duration, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

const QuickSummary = ({ stats }) => {
  const { duration, suites, testsRegistered, passes, failures, pending, skipped } = stats;
  return (
    <div className={ cx('cnt') }>
      <ul className={ cx('list') }>
        <li className={ cx('item', 'duration') } title='Duration'>
          <Icon name='timer' className={ cx('icon') } />
          <Duration unitsClassName={ cx('duration-units') } timer={ duration } isSummary />
        </li>
        <li className={ cx('item', 'suites') } title='Suites'>
          <Icon name='library_books' className={ cx('icon') } />{ suites }
        </li>
        <li className={ cx('item', 'tests') } title='Tests'>
          <Icon name='assignment' className={ cx('icon') } />{ testsRegistered }
        </li>
      </ul>
      <ul className={ cx('list') }>
        <li className={ cx('item', 'passes') } title='Passed'>
          <Icon name='check' className={ cx('icon', 'circle-icon') } />{ passes }
        </li>
        <li className={ cx('item', 'failures') } title='Failed'>
          <Icon name='close' className={ cx('icon', 'circle-icon') } />{ failures }
        </li>
        { !!pending && (
          <li className={ cx('item', 'pending') } title='Pending'>
            <Icon name='pause' className={ cx('icon', 'circle-icon') } />{ pending }
          </li>)
        }
        { !!skipped && (
          <li className={ cx('item', 'skipped') } title='Skipped'>
            <Icon name='stop' className={ cx('icon', 'circle-icon') } />{ skipped }
          </li>)
        }
      </ul>
    </div>
  );
};

QuickSummary.propTypes = {
  stats: PropTypes.object
};

QuickSummary.displayName = 'QuickSummary';

export default QuickSummary;
