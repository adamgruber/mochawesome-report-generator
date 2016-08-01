import React, { PropTypes } from 'react';
import { formatSummaryDuration, getSummaryDurationUnits } from '../utils';

const QuickSummary = (props) => {
  const { stats } = props;
  const { duration, suites, testsRegistered, passes, failures, pending } = stats;
  return (
    <div className='quick-summary-cnt'>
      <ul className='list-unstyled quick-summary'>
        <li className='qs-item summary-duration' title='Duration'>{ formatSummaryDuration(duration) }<span>{ getSummaryDurationUnits(duration) }</span></li>
        <li className='qs-item summary-suites' title='Suites'>{ suites }</li>
        <li className='qs-item summary-tests' title='Tests'>{ testsRegistered }</li>
        <li className='qs-item summary-passes' title='Passed' data-filter='passed'>{ passes }</li>
        <li className='qs-item summary-failures' title='Failed' data-filter='failed'>{ failures }</li>
        <li className='qs-item summary-pending' title='Pending' data-filter='pending'>{ pending }</li>
      </ul>
    </div>
  );
};

QuickSummary.propTypes = {
  stats: PropTypes.object
};

export default QuickSummary;
