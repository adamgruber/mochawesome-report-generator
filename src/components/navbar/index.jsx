import React, { PropTypes } from 'react';
import { QuickSummary, Icon } from 'components/';
import reportStore from '../../js/reportStore';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './navbar.css';

const cx = classNames.bind(styles);


const Navbar = ({ reportTitle, stats }) => {
  const reportDate = moment(stats.end).format('dddd, MMMM D YYYY, hh:mma');

  const onClickFn = () => (reportStore.openSideNav());

  return (
    <div className={ cx('navbar') } role='navigation'>
      <div className='container'>
        <button
          onClick={ onClickFn }
          className={ cx('menu-button', 'open-menu') }>
          <Icon name='menu' />
        </button>
        <div className={ cx('report-info-cnt') }>
          <h1 className={ cx('report-title') }>{ reportTitle }</h1>
          <h3 className={ cx('report-date') }>{ reportDate }</h3>
        </div>
        <div className={ cx('nav-right') }>
          <QuickSummary stats={ stats } />
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
