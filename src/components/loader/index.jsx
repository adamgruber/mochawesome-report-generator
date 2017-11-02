import React from 'react';
import classNames from 'classnames/bind';
import styles from './loader.css';

const cx = classNames.bind(styles);

const Loader = () => (
  <div className={ cx('component') }>
    <div className={ cx('spinner') } />
    <h4 className={ cx('text') }>Generating Report</h4>
  </div>
);

export default Loader;
