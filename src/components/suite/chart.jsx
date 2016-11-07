/* eslint-disable no-new */
import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import Chart from 'chart.js';
import classNames from 'classnames/bind';
import styles from './suite.css';

const cx = classNames.bind(styles);

const chartColors = {
  pass: '#4caf50',
  fail: '#f44336',
  pend: '#03a9f4',
  skip: 'rgba(0, 0, 0, 0.38)'
};

class SuiteChart extends Component {
  static displayName = 'SuiteChart';

  static propTypes = {
    totalPasses: PropTypes.number,
    totalFailures: PropTypes.number,
    totalPending: PropTypes.number,
    totalSkipped: PropTypes.number
  };

  componentDidMount() {
    this.renderChart();
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  _getChartData = () => {
    const { pass, fail, pend, skip } = chartColors;
    const { totalPasses, totalFailures, totalPending, totalSkipped } = this.props;
    const chartData = {
      labels: [ 'Passed', 'Failed', 'Pending', 'Skipped' ],
      datasets: [ {
        data: [ totalPasses, totalFailures, totalPending, totalSkipped ],
        backgroundColor: [ pass, fail, pend, skip ],
        hoverBackgroundColor: [ pass, fail, pend, skip ],
        hoverBorderColor: [ '#fff', '#fff', '#fff', '#fff' ]
      } ]
    };
    return chartData;
  }

  _getChartOpts = () => ({
    cutoutPercentage: 65,
    rotation: 0.5 * Math.PI,
    animation: {
      easing: 'easeOutQuint'
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    elements: {
      arc: {
        borderWidth: 1
      }
    }
  })

  renderChart() {
    new Chart(this.node, {
      type: 'doughnut',
      data: this._getChartData(),
      options: this._getChartOpts()
    });
  }

  render() {
    return (
      <div className={ cx('chart-wrap') }>
        <canvas
          ref={ node => (this.node = node) }
          width='50'
          height='50' />
      </div>
    );
  }
}

export default SuiteChart;
