import React, { PropTypes } from 'react';
import { QuickSummary } from 'components/';
import reportStore from '../../js/reportStore';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './navbar.css';

const cx = classNames.bind(styles);


const Navbar = ({ reportTitle, stats }) => {
  const reportDate = moment(stats.end).format('dddd, MMMM D YYYY, hh:mma');

  const onClickFn = () => {
    // do something
    reportStore.sideNavOpen = true;
  };

  return (
    <div className={ cx('navbar') } role='navigation'>
      <div className='container'>
        <div className={ cx('report-info-cnt') }>
          <h1 className={ cx('report-title') }>{ reportTitle }</h1>
          <h3 className={ cx('report-date') }>{ reportDate }</h3>
        </div>
        <div className={ cx('nav-right') }>
          <QuickSummary stats={ stats } />
          <button
            onClick={ onClickFn }
            className={ cx('menu-button', 'open-menu') }>
            <i className='icon-menu'></i>
          </button>
        </div>
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
