import React, { Component, PropTypes } from 'react';
import { Navbar } from './index';
import 'styles/app.global.css';
import styles from './report.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class MochawesomeReport extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  state = {};

  render() {
    const { reportTitle, stats } = this.props.data;
    return (
      <div className={ cx('report') }>
        <Navbar reportTitle={ reportTitle } stats={ stats } />
        { /* <Summary /> */ }
        { /* <StatusBar /> */ }
      </div>
    );
  }
}

export default MochawesomeReport;
