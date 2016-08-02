import React, { PropTypes } from 'react';
import { QuickSummary } from 'components/';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './navbar.css';

const cx = classNames.bind(styles);


const Navbar = (props) => {
  const { reportTitle, stats } = props;
  const reportDate = moment(stats.end).format('dddd, MMMM D YYYY, hh:mma');

  return (
    <div className={ cx('navbar') } role='navigation'>
      <div className='container'>
        <div className={ cx('report-info-cnt') }>
          <h1 className={ cx('report-title') }>{ reportTitle }</h1>
          <h3 className={ cx('report-date') }>{ reportDate }</h3>
        </div>
        <div className={ cx('nav-right') }>
          <QuickSummary stats={ stats } />
          <button className='nav-menu-btn open-menu'><i className='icon-menu'></i></button>
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  reportTitle: PropTypes.string,
  stats: PropTypes.object
};

export default Navbar;
