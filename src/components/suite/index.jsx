import React, { PropTypes } from 'react';
import { Test } from 'components';
import { formatDuration } from '../../utils';
import classNames from 'classnames/bind';
import styles from './suite.css';

const cx = classNames.bind(styles);

const Suite = (props) => {
  const { suite } = props;
  const { root, rootEmpty, suites, tests, uuid, title, file,
    hasSuites, hasTests, hasFailures, hasPending, hasSkipped,
    hasPasses, duration, totalTests, totalPasses, totalFailures,
    totalPending, totalSkipped } = suite;

  const subSuites = () => !!suites && suites.map((subSuite, i) => <Suite key={ i } suite={ subSuite } />);

  const cxname = cx('component', {
    'root-suite': root,
    'has-suites': hasSuites,
    'has-tests': hasTests,
    'has-passed': hasPasses,
    'has-failed': hasFailures,
    'has-pending': hasPending,
    'has-skipped': hasSkipped
  });

  if (rootEmpty) {
    return subSuites();
  }

  return (
    <section className={ cx('wrap') }>
      <div id={ uuid } className={ cxname }>
        <h3 className={ cx('title') }>{ title === '' ? ' ' : title }</h3>
        <h5 className={ cx('filename') }>{ file === '' ? ' ' : file }</h5>
        { hasTests && (
          <div>
            <div className={ cx('chart-wrap') }>
              <canvas
                id={ uuid }
                className='chart'
                width='50'
                height='50'
                data-total-passes={ totalPasses }
                data-total-failures={ totalFailures }
                data-total-pending={ totalPending }
                data-total-skipped={ totalSkipped }></canvas>
            </div>
            <div className={ cx('data-wrap') }>
              <ul className={ cx('summary', 'list-unstyled') }>
                <li className={ cx('summary-item', 'duration') }>{ formatDuration(duration) }</li>
                <li className={ cx('summary-item', 'tests') }>{ totalTests }</li>
                <li className={ cx('summary-item', 'passed') }>{ totalPasses }</li>
                <li className={ cx('summary-item', 'failed') }>{ totalFailures }</li>
                <li className={ cx('summary-item', 'pending') }>{ totalPending }</li>
              </ul>
              <div className={ cx('test-wrap') }>
                <div
                  className={ cx('test-header') }
                  data-toggle='collapse'
                  data-target={ `#${uuid}-test-list` }>
                  <h4 className={ cx('test-header-title') }>Tests</h4>
                </div>
                <div
                  id={ `${uuid}-test-list` }
                  className={ cx('list-group', 'test-list', 'collapse', 'in') }>
                  { !!tests && tests.map((test, i) => <Test key={ i } test={ test } />) }
                </div>
              </div>
            </div>
          </div>
        ) }
        { subSuites() }
      </div>
    </section>
  );
};

Suite.propTypes = {
  suite: PropTypes.object
};

export default Suite;
