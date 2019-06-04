/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './status-bar.css';

const cx = classNames.bind(styles);

const StatusBar = ({ stats }) => {
  const {
    hasOther,
    hasSkipped,
    other,
    skipped,
    pendingPercent,
    passPercent,
    passPercentClass,
  } = stats;
  const cxname = cx('component', {
    'has-failed-hooks': hasOther,
    'has-skipped-tests': hasSkipped,
  });
  const skippedText = `${skipped} Skipped Test${skipped > 1 ? 's' : ''}`;
  const failedText = `${other} Failed Hook${other > 1 ? 's' : ''}`;

  return (
    <div className={cxname}>
      <div className="container">
        <div className="row">
          {!!hasOther && (
            <div className={cx('item', 'hooks', 'danger')}>{failedText}</div>
          )}
          {!!hasSkipped && (
            <div className={cx('item', 'skipped', 'danger')}>{skippedText}</div>
          )}
          <div
            className={cx(
              'item',
              'pending-pct'
            )}>{`${pendingPercent}% Pending`}</div>
          <div
            className={cx(
              'item',
              'passing-pct',
              passPercentClass
            )}>{`${passPercent}% Passing`}</div>
        </div>
      </div>
    </div>
  );
};

StatusBar.propTypes = {
  stats: PropTypes.object,
};

export default StatusBar;
