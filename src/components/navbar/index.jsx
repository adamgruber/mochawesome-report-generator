import React, { PropTypes } from 'react';
import { QuickSummary, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './navbar.css';
import reportStore from '../../js/reportStore';

const cx = classNames.bind(styles);


const Navbar = ({ reportTitle, stats, qsNodeRef, qsWidth, mobileBreakpoint }) => {
  const onClickFn = () => (reportStore.openSideNav());

  const { passPercent } = stats;
  const failPercent = 100 - passPercent;

  const titleCntStyle = (!mobileBreakpoint && qsWidth) ? { paddingRight: qsWidth } : null;

  return (
    <div className={ cx('component', 'z-depth-1') } role='navigation'>
      <button
        onClick={ onClickFn }
        className={ cx('menu-button', 'open-menu') }>
        <Icon name='menu' />
      </button>
      <div className={ cx('report-info-cnt') } style={ titleCntStyle }>
        <h1 className={ cx('report-title') } title={ reportTitle }>{ reportTitle }</h1>
      </div>
      <div className={ cx('stats') } ref={ qsNodeRef }>
        <QuickSummary stats={ stats } />
      </div>
      <div className={ cx('pct-bar') }>
        <span
          className={ cx('pct-bar-segment', 'pass') }
          style={ { width: `${passPercent}%` } }
          title={ `${passPercent.toFixed(1)}% Passing` } />
        <span
          className={ cx('pct-bar-segment', 'fail') }
          style={ { width: `${failPercent}%` } }
          title={ `${failPercent.toFixed(1)}% Failing` } />
      </div>
    </div>
  );
};

Navbar.propTypes = {
  reportTitle: PropTypes.string,
  stats: PropTypes.object,
  qsNodeRef: PropTypes.func,
  qsWidth: PropTypes.number,
  mobileBreakpoint: PropTypes.bool
};

Navbar.displayName = 'Navbar';

export default Navbar;
