import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './loader.css';

const cx = classNames.bind(styles);

@inject('reportStore')
@observer
class Loader extends Component {
  static propTypes = {
    reportStore: PropTypes.object,
  };

  render() {
    const { isLoading } = this.props.reportStore;
    return (
      isLoading && (
        <div className={cx('component')}>
          <div className={cx('wrap')}>
            <div className={cx('spinner')} />
            <h4 className={cx('text')}>Generating Report</h4>
          </div>
        </div>
      )
    );
  }
}

export default Loader;
