import React from 'react';
import PropTypes from 'prop-types';
import { TestList } from 'components/test';
import { SuiteChart, SuiteList, SuiteSummary } from 'components/suite';
import classNames from 'classnames/bind';
import styles from './suite.css';

const cx = classNames.bind(styles);

const Suite = ({ className, suite, enableChart, enableCode }) => {
  const { root, rootEmpty, suites, tests, beforeHooks, afterHooks, uuid, title, file,
    hasSuites, hasTests, hasFailures, hasPending, hasSkipped,
    hasPasses, duration, totalTests, totalPasses, totalFailures,
    totalPending, totalSkipped } = suite;

  const subSuites = isMain => hasSuites && (
    <SuiteList
      suites={ suites }
      enableChart={ enableChart }
      enableCode={ enableCode }
      main={ isMain } />
  );

  const testListComp = () => hasTests && (
    <TestList
      uuid={ uuid }
      tests={ tests }
      beforeHooks={ beforeHooks }
      afterHooks={ afterHooks }
      enableCode={ enableCode } />
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
    'has-skipped': hasSkipped,
    'chart-enabled': enableChart
  });

  const summaryProps = {
    duration,
    totalTests,
    totalPasses,
    totalFailures,
    totalPending,
    totalSkipped,
    className: cx({ 'no-margin': title === '' && file === '' })
  };
  const chartProps = { totalPasses, totalFailures, totalPending, totalSkipped };

  if (rootEmpty) {
    return subSuites(true);
  }

  return (
    <section className={ cxname } id={ uuid }>
      <header className={ cx('header') }>
        { title !== '' && <h3 className={ cx('title') }>{ title }</h3> }
        { file !== '' && <h6 className={ cx('filename') }>{ file }</h6> }
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
