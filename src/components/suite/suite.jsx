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

  const subSuites = () => hasSuites && <SuiteList suites={ suites } />;

  const testListComp = () => hasTests && (
    <TestList className={ cx('test-list') } uuid={ uuid } tests={ tests } />
  );

  const cxname = cx('component', className, {
    'z-depth-1': true,
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
    <section className={ cxname } id={ uuid }>
      <header className={ cx('header') }>
        <h3 className={ cx('title') }>{ title === '' ? ' ' : title }</h3>
        <h6 className={ cx('filename') }>{ file === '' ? ' ' : file }</h6>
        { hasTests && <SuiteChart { ...chartProps } /> }
        { hasTests && <SuiteSummary { ...summaryProps } /> }
      </header>
      <div className={ cx('body') }>
        { testListComp() }
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
