import React, { PropTypes } from 'react';
import { QuickSummary, Icon } from 'components/';
import reportStore from '../../js/reportStore';
// import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './navbar.css';

const cx = classNames.bind(styles);


const Navbar = ({ reportTitle, stats }) => {
  // const reportDate = moment(stats.end).format('dddd, MMMM D YYYY, hh:mma');

  const onClickFn = () => (reportStore.openSideNav());

  const { passPercent, pendingPercent } = stats;
  const failPercent = 100 - passPercent - pendingPercent;

  return (
    <div className={ cx('navbar', 'z-depth-1') } role='navigation'>
      <button
        onClick={ onClickFn }
        className={ cx('menu-button', 'open-menu') }>
        <Icon name='menu' />
      </button>
      <div className={ cx('report-info-cnt') }>
        <h1 className={ cx('report-title') }>{ reportTitle }</h1>
      </div>
      <div className={ cx('nav-right') }>
        <QuickSummary stats={ stats } />
      </div>
      <div className={ cx('pct-bar') }>
        <span
          className={ cx('pct-bar-segment', 'pass') }
          style={ { width: `${passPercent}%` } }
          title={ `${passPercent}% Passing` } />
        <span
          className={ cx('pct-bar-segment', 'fail') }
          style={ { width: `${failPercent}%` } }
          title={ `${failPercent}% Failing` } />
        <span
          className={ cx('pct-bar-segment', 'pend') }
          style={ { width: `${pendingPercent}%` } }
          title={ `${pendingPercent}% Pending` } />
      </div>
    </div>
  );
};

Navbar.propTypes = {
  reportTitle: PropTypes.string,
  stats: PropTypes.object
};

Navbar.displayName = 'Navbar';

export default Navbar;
