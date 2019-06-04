import React from 'react';
import PropTypes from 'prop-types';
import { QuickSummary, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './navbar.css';

const cx = classNames.bind(styles);

const Navbar = ({ onMenuClick, reportTitle, stats }) => {
  const { passPercent, pendingPercent } = stats;

  const failPercent = 100 - passPercent;
  const allPending = pendingPercent === 100;
  const showPctBar = passPercent !== null && pendingPercent !== null;

  const pctBar = (prop, cname, title) => (
    <span
      className={cx('pct-bar-segment', cname)}
      style={{ width: `${prop}%` }}
      title={`${prop.toFixed(2)}% ${title}`}
    />
  );

  return (
    <div className={cx('component', 'z-depth-1')} role="navigation">
      <div className={cx('report-info-cnt')}>
        <button
          type="button"
          onClick={onMenuClick}
          className={cx('menu-button', 'open-menu')}>
          <Icon name="menu" />
        </button>
        <h1 className={cx('report-title')} title={reportTitle}>
          {reportTitle}
        </h1>
      </div>
      <div className={cx('stats')}>
        <QuickSummary stats={stats} />
      </div>
      {showPctBar && (
        <div className={cx('pct-bar')}>
          {allPending && pctBar(pendingPercent, 'pend', 'Pending')}
          {!allPending && pctBar(passPercent, 'pass', 'Passing')}
          {!allPending && pctBar(failPercent, 'fail', 'Failing')}
        </div>
      )}
    </div>
  );
};

Navbar.propTypes = {
  onMenuClick: PropTypes.func,
  reportTitle: PropTypes.string,
  stats: PropTypes.object,
};

Navbar.displayName = 'Navbar';

export default Navbar;
