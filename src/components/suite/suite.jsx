import React, { PropTypes } from 'react';
import { TestList } from 'components/test';
import { SuiteChart, SuiteList, SuiteSummary } from 'components/suite';
import classNames from 'classnames/bind';
import styles from './suite.css';

const cx = classNames.bind(styles);

const Suite = (props) => {
  const { className, suite } = props;
  const { root, rootEmpty, suites, tests, uuid, title, file,
    hasSuites, hasTests, hasFailures, hasPending, hasSkipped,
    hasPasses, duration, totalTests, totalPasses, totalFailures,
    totalPending, totalSkipped } = suite;

  const subSuites = () => <SuiteList suites={ suites } />;

  const cxname = cx('component', {
    'root-suite': root,
    'has-suites': hasSuites,
    'has-tests': hasTests,
    'has-passed': hasPasses,
    'has-failed': hasFailures,
    'has-pending': hasPending,
    'has-skipped': hasSkipped
  });

  const summaryProps = { duration, totalTests, totalPasses, totalFailures, totalPending };
  const chartProps = { uuid, totalPasses, totalFailures, totalPending, totalSkipped };

  console.log(suite);

  if (rootEmpty) {
    return subSuites();
  }

  return (
    <section className={ cx('wrap', className) }>
      <div id={ uuid } className={ cxname }>
        <h3 className={ cx('title') }>{ title === '' ? ' ' : title }</h3>
        <h5 className={ cx('filename') }>{ file === '' ? ' ' : file }</h5>
        { hasTests && (
          <div>
            <SuiteChart { ...chartProps } />
            <div className={ cx('data-wrap') }>
              <SuiteSummary { ...summaryProps } />
              <div className={ cx('test-wrap') }>
                <div
                  className={ cx('test-header') }
                  data-toggle='collapse'
                  data-target={ `#${uuid}-test-list` }>
                  <h4 className={ cx('test-header-title') }>Tests</h4>
                </div>
                <TestList
                  uuid={ uuid }
                  className={ cx('list-group', 'test-list', 'collapse', 'in') }
                  tests={ tests } />
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
  suite: PropTypes.object,
  className: PropTypes.any
};

export default Suite;
