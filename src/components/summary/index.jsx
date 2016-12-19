import React, { PropTypes } from 'react';
import { Duration } from 'components';
import classNames from 'classnames/bind';
import styles from './summary.css';

const cx = classNames.bind(styles);

const Summary = props => {
  const { stats } = props;
  const { duration, suites, testsRegistered, passes, failures, pending } = stats;
  return (
    <div className={ cx('cnt') }>
      <div className='container'>
        <div className='row'>
          <div className={ cx('col', 'duration') }>
            <h1 className={ cx('count') }><Duration timer={ duration } isSummary /></h1>
            <h4 className={ cx('label') }>{ }</h4>
          </div>
          <div className={ cx('col', 'suites') } title='Suites'>
            <h1 className={ cx('count') }>{ suites }</h1>
            <h4 className={ cx('label') }>{ suites.length > 1 ? 'Suites' : 'Suite' }</h4>
          </div>
          <div className={ cx('col', 'tests') } title='Tests'>
            <h1 className={ cx('count') }>{ testsRegistered }</h1>
            <h4 className={ cx('label') }>{ testsRegistered.length > 1 ? 'Tests' : 'Test' }</h4>
          </div>
          <div className={ cx('col', 'passes') } title='Passed'>
            <h1 className={ cx('count') }>{ passes }</h1>
            <h4 className={ cx('label') }>Passed</h4>
          </div>
          <div className={ cx('col', 'failures') } title='Failed'>
            <h1 className={ cx('count') }>{ failures }</h1>
            <h4 className={ cx('label') }>Failed</h4>
          </div>
          <div className={ cx('col', 'pending') } title='Pending'>
            <h1 className={ cx('count') }>{ pending }</h1>
            <h4 className={ cx('label') }>Pending</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

Summary.propTypes = {
  stats: PropTypes.object
};

export default Summary;
