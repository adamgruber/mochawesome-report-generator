import React from 'react';
import PropTypes from 'prop-types';
import { Duration, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

const QuickSummary = ({ onQuickFilterClick, singleFilter, stats }) => {
  const {
    duration,
    suites,
    testsRegistered,
    passes,
    failures,
    pending,
    skipped,
    flaky,
  } = stats;

  const filterClasses = singleFilter
    ? ['single-filter', `single-filter--${singleFilter.slice(4).toLowerCase()}`]
    : '';

  return (
    <div className={cx('cnt')}>
      <ul className={cx('list')}>
        <li className={cx('item', 'duration')} title="Duration">
          <Icon name="timer" className={cx('icon')} />
          <Duration timer={duration} />
        </li>
        <li className={cx('item', 'suites')} title="Suites">
          <Icon name="library_books" className={cx('icon')} />
          {suites}
        </li>
        <li className={cx('item', 'tests')} title="Tests">
          <Icon name="assignment" className={cx('icon')} />
          {testsRegistered}
        </li>
      </ul>
      <ul className={cx('list', filterClasses)}>
        <li className={cx('item', 'passes')} title="Passed">
          <button
            type="button"
            onClick={() => onQuickFilterClick('showPassed')}>
            <Icon name="check" className={cx('icon', 'circle-icon')} />
            {passes}
          </button>
        </li>
        <li className={cx('item', 'failures')} title="Failed">
          <button
            type="button"
            onClick={() => onQuickFilterClick('showFailed')}>
            <Icon name="close" className={cx('icon', 'circle-icon')} />
            {failures}
          </button>
        </li>
        <li className={cx('item', 'flaky')} title="Flaky">
          <button
            type="button"
            onClick={() => onQuickFilterClick('showFlaky')}>
            <Icon name="warning" className={cx('icon', 'circle-icon')} />
            {flaky}
          </button>
        </li>
        {!!pending && (
          <li className={cx('item', 'pending')} title="Pending">
            <button
              type="button"
              onClick={() => onQuickFilterClick('showPending')}>
              <Icon name="pause" className={cx('icon', 'circle-icon')} />
              {pending}
            </button>
          </li>
        )}
        {!!skipped && (
          <li className={cx('item', 'skipped')} title="Skipped">
            <button
              type="button"
              onClick={() => onQuickFilterClick('showSkipped')}>
              <Icon name="stop" className={cx('icon', 'circle-icon')} />
              {skipped}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

QuickSummary.propTypes = {
  onQuickFilterClick: PropTypes.func,
  singleFilter: PropTypes.string,
  stats: PropTypes.object,
};

QuickSummary.displayName = 'QuickSummary';

export default QuickSummary;
