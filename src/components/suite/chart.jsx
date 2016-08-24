import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './suite.css';

const cx = classNames.bind(styles);

const SuiteChart = (props) => {
  const { uuid, totalPasses, totalFailures, totalPending, totalSkipped } = props;
  return (
    <div className={ cx('chart-wrap') }>
      <canvas
        id={ `${uuid}-chart` }
        className='chart'
        width='50'
        height='50'
        data-total-passes={ totalPasses }
        data-total-failures={ totalFailures }
        data-total-pending={ totalPending }
        data-total-skipped={ totalSkipped }></canvas>
    </div>
  );
};

SuiteChart.propTypes = {
  uuid: PropTypes.string,
  totalPasses: PropTypes.number,
  totalFailures: PropTypes.number,
  totalPending: PropTypes.number,
  totalSkipped: PropTypes.number
};

SuiteChart.displayName = 'SuiteChart';

export default SuiteChart;
