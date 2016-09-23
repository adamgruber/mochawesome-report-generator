import React, { PropTypes } from 'react';
import { Duration, Icon } from '../../components';
import classNames from 'classnames/bind';
import styles from './suite-summary.css';

const cx = classNames.bind(styles);

const SuiteSummary = (props) => {
  const { duration, totalTests, totalPasses, totalFailures, totalPending } = props;

  return (
    <ul className={ cx('component') }>
      <li className={ cx('summary-item', 'duration') }>
        <Icon name='timer' className={ cx('icon') } size={ 18 } />
        <Duration timer={ duration } />
      </li>
      <li className={ cx('summary-item', 'tests') }>
        <Icon name='assignment' className={ cx('icon') } size={ 18 } />{ totalTests }
      </li>
      <li className={ cx('summary-item', 'passed') }>
        <Icon name='check' className={ cx('icon') } size={ 18 } />{ totalPasses }
      </li>
      <li className={ cx('summary-item', 'failed') }>
        <Icon name='close' className={ cx('icon') } size={ 18 } />{ totalFailures }
      </li>
      <li className={ cx('summary-item', 'pending') }>
        <Icon name='pause' className={ cx('icon') } size={ 18 } />{ totalPending }
      </li>
    </ul>
  );
};

SuiteSummary.propTypes = {
  duration: PropTypes.number,
  totalTests: PropTypes.number,
  totalPasses: PropTypes.number,
  totalFailures: PropTypes.number,
  totalPending: PropTypes.number
};

SuiteSummary.displayName = 'SuiteSummary';

export default SuiteSummary;
