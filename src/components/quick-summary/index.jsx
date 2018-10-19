import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Duration, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

@inject('reportStore') @observer
class QuickSummary extends Component {
  static propTypes = {
    reportStore: PropTypes.shape({
      stats: PropTypes.object,
      toggleFilter: PropTypes.func
    })
  };
  render() {
    const {
      stats,
      toggleFilter
    } = this.props.reportStore;
    const { duration, suites, testsRegistered, passes, failures, pending, skipped } = stats;
    return (
      <div className={ cx('cnt') }>
        <ul className={ cx('list') }>
          <li className={ cx('item', 'duration') } title='Duration'>
            <Icon name='timer' className={ cx('icon') } />
            <Duration unitsClassName={ cx('duration-units') } timer={ duration } isSummary />
          </li>
          <li className={ cx('item', 'suites') } title='Suites'>
            <Icon name='library_books' className={ cx('icon') } />{ suites }
          </li>
          <li className={ cx('item', 'tests') } title='Tests'>
            <Icon name='assignment' className={ cx('icon') } />{ testsRegistered }
          </li>
        </ul>
        <ul className={ cx('list') }>
          <li className={ cx('item', 'passes') } title='Show Passed'>
            <div className={ cx('control') }onClick={ () => (toggleFilter('showPassed')) }>
              <Icon name='check' className={ cx('icon', 'circle-icon') } />{ passes }
            </div>
          </li>
          <li className={ cx('item', 'failures') } title='Show Failed'>
            <div className={ cx('control') }onClick={ () => (toggleFilter('showFailed')) }>
              <Icon name='close' className={ cx('icon', 'circle-icon') } />{ failures }
            </div>
          </li>
          { !!pending && (
            <li className={ cx('item', 'pending') } title='Show Pending'>
              <div className={ cx('control') }onClick={ () => (toggleFilter('showPending')) }>
                <Icon name='pause' className={ cx('icon', 'circle-icon') } />{ pending }
              </div>
            </li>)
          }
          { !!skipped && (
            <li className={ cx('item', 'skipped') } title='Show Skipped'>
              <div className={ cx('control') }onClick={ () => (toggleFilter('showSkipped')) }>
                <Icon name='stop' className={ cx('icon', 'circle-icon') } />{ skipped }
              </div>
            </li>)
          }
        </ul>
      </div>
    );
  }
}

QuickSummary.displayName = 'QuickSummary';

export default QuickSummary;
