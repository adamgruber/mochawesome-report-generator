import React, { PropTypes } from 'react';
import { TestList } from 'components/test';
import { SuiteChart, SuiteList, SuiteSummary } from 'components/suite';
import classNames from 'classnames/bind';
import styles from './suite.css';

const cx = classNames.bind(styles);

const Suite = ({ className, suite, enableChart, enableCode }) => {
  const { root, rootEmpty, suites, tests, uuid, title, file,
    hasSuites, hasTests, hasFailures, hasPending, hasSkipped,
    hasPasses, duration, totalTests, totalPasses, totalFailures,
    totalPending, totalSkipped } = suite;

  const subSuites = () => hasSuites && (
    <SuiteList suites={ suites } enableChart={ enableChart } enableCode={ enableCode } />
  );

  const testListComp = () => hasTests && (
    <TestList uuid={ uuid } tests={ tests } enableCode={ enableCode } />
  );

  const cxname = cx('component', className, {
    'root-suite': root,
    'has-suites': hasSuites,
    'no-suites': !hasSuites,
    'has-tests': hasTests,
    'no-tests': !hasTests,
    'has-passed': hasPasses,
    'has-failed': hasFailures,
    'has-pending': hasPending,
    'has-skipped': hasSkipped
  });

  const summaryProps = {
    duration, totalTests, totalPasses, totalFailures, totalPending, totalSkipped
  };
  const chartProps = { totalPasses, totalFailures, totalPending, totalSkipped };

  if (rootEmpty) {
    return subSuites();
  }

  return (
    <section className={ cxname } id={ uuid }>
      <header className={ cx('header') }>
        <h3 className={ cx('title') }>{ title === '' ? ' ' : title }</h3>
        <h6 className={ cx('filename') }>{ file === '' ? ' ' : file }</h6>
        { hasTests && enableChart && <SuiteChart { ...chartProps } /> }
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
  className: PropTypes.string,
  enableChart: PropTypes.bool,
  enableCode: PropTypes.bool
};

export default Suite;
