/* eslint-disable no-new */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Chartist from 'chartist';
import classNames from 'classnames/bind';
import styles from './suite.css';

const cx = classNames.bind(styles);

class SuiteChart extends Component {
  static displayName = 'SuiteChart';

  static propTypes = {
    totalPasses: PropTypes.number,
    totalFailures: PropTypes.number,
    totalPending: PropTypes.number,
    totalSkipped: PropTypes.number,
  };

  componentDidMount() {
    this.renderChart();
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  renderChart() {
    const {
      totalPasses,
      totalFailures,
      totalPending,
      totalSkipped,
    } = this.props;
    new Chartist.Pie(
      this.node,
      {
        series: [totalPasses, totalFailures, totalPending, totalSkipped],
      },
      {
        classNames: {
          sliceDonutSolid: cx('chart-slice'),
        },
        chartPadding: 0,
        donut: true,
        donutSolid: true,
        donutWidth: 9,
        ignoreEmptyValues: true,
        showLabel: false,
        startAngle: 180,
      }
    );
  }

  render() {
    return (
      <div
        className={cx('chart-wrap', 'ct-chart')}
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}

export default SuiteChart;
