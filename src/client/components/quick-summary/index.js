import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Duration, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

@inject('reportStore')
class QuickSummary extends Component {
  static propTypes = {
    stats: PropTypes.object,
    reportStore: PropTypes.shape({
      filterOnly: PropTypes.func,
    }),
  };

  render() {
    const {
      duration,
      suites,
      testsRegistered,
      passes,
      failures,
      pending,
      skipped,
    } = this.props.stats;
    const { filterOnly } = this.props.reportStore;

    return (
      <div className={cx('cnt')}>
        <ul className={cx('list')}>
          <li className={cx('item', 'duration')} title="Duration">
            <Icon name="timer" className={cx('icon')} />
            <Duration
              unitsClassName={cx('duration-units')}
              timer={duration}
              isSummary
            />
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
        <ul className={cx('list')}>
          <li className={cx('item', 'passes')} title="Passed">
            <Icon name="check" className={cx('icon', 'circle-icon')} onClick={() => filterOnly('showPassed')} />
            {passes}
          </li>
          <li className={cx('item', 'failures')} title="Failed">
            <Icon name="close" className={cx('icon', 'circle-icon')} onClick={() => filterOnly('showFailed')} />
            {failures}
          </li>
          {!!pending && (
            <li className={cx('item', 'pending')} title="Pending">
              <Icon name="pause" className={cx('icon', 'circle-icon')} onClick={() => filterOnly('showPending')} />
              {pending}
            </li>
          )}
          {!!skipped && (
            <li className={cx('item', 'skipped')} title="Skipped">
              <Icon name="stop" className={cx('icon', 'circle-icon')} onClick={() => filterOnly('showSkipped')} />
              {skipped}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

QuickSummary.displayName = 'QuickSummary';

export default QuickSummary;
