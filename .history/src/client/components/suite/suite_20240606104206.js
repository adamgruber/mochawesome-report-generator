import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Icon } from 'components';
import { TestList } from 'components/test';
import { SuiteChart, SuiteList, SuiteSummary } from 'components/suite';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';
import styles from './suite.css';

const cx = classNames.bind(styles);

class Suite extends Component {
  constructor() {
    super();
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
  }

  state = {
    expanded: true,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  toggleExpandedState() {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  render() {
    const { className, suite, enableChart, enableCode } = this.props;
    const { expanded } = this.state;
    const {
      root,
      rootEmpty,
      suites,
      tests,
      beforeHooks,
      afterHooks,
      uuid,
      title,
      file,
      duration,
    } = suite;

    const hasSuites = !isEmpty(suites);
    const hasTests = !isEmpty(tests);
    const hasPasses = !isEmpty(suite.passes);
    const hasFailures = !isEmpty(suite.failures);
    const hasPending = !isEmpty(suite.pending);
    const hasSkipped = !isEmpty(suite.skipped);
    const hasBeforeHooks = !isEmpty(beforeHooks);
    const hasAfterHooks = !isEmpty(afterHooks);
    const totalTests = hasTests ? tests.length : 0;
    const totalPasses = hasPasses ? suite.passes.length : 0;
    const totalFailures = hasFailures ? suite.failures.length : 0;
    const totalPending = hasPending ? suite.pending.length : 0;
    const totalSkipped = hasSkipped ? suite.skipped.length : 0;

    const subSuites = isMain =>
      hasSuites && (
        <SuiteList
          suites={suites}
          enableChart={enableChart}
          enableCode={enableCode}
          main={isMain}
        />
      );

    const testListComp = () =>
      (hasTests || hasBeforeHooks || hasAfterHooks) && (
        <TestList
          uuid={uuid}
          tests={tests}
          beforeHooks={beforeHooks}
          afterHooks={afterHooks}
          enableCode={enableCode}
        />
      );

    const cxname = cx('component', className, {
      'root-suite': root,
      'has-suites': hasSuites,
      'no-suites': !hasSuites,
      'has-tests': hasTests,
      'no-tests': !hasTests && !hasBeforeHooks && !hasAfterHooks,
      'has-passed': hasPasses,
      'has-failed': hasFailures,
      'has-pending': hasPending,
      'has-skipped': hasSkipped,
      'chart-enabled': enableChart,
    });

    const summaryProps = {
      duration,
      totalTests,
      totalPasses,
      totalFailures,
      totalPending,
      totalSkipped,
      className: cx({ 'no-margin': title === '' && file === '' }),
    };
    const chartProps = {
      totalPasses,
      totalFailures,
      totalPending,
      totalSkipped,
    };

    if (rootEmpty && !hasBeforeHooks && !hasAfterHooks) {
      return subSuites(true);
    }

    const hideHeader = root && !hasTests && (hasBeforeHooks || hasAfterHooks);

    return (
      <li id={uuid}>
        <section className={cxname}>
          {!hideHeader && (
            <header className={cx('header')}>
            <button
              aria-expanded={expanded}
              type="button"
              onClick={this.toggleExpandedState}
              className={cx('header-btn')}>
              {title !== '' && <h3 className={cx('title')}>
                <span>{title}</span>
                <Icon name={expanded ? 'expand_less' : 'expand_more'} className={cx('icon')} size={18} />
              </h3>}
              {file !== '' && <h6 className={cx('filename')}>{file}</h6>}
              {hasTests && enableChart && <SuiteChart {...chartProps} />}
              {hasTests && <SuiteSummary {...summaryProps} />}
              </button>
            </header>
          )}
          <div className={cx('body', !expanded && 'hide')}>
            {testListComp()}
            {subSuites()}
          </div>
        </section>
      </li>
    );
  }
}

Suite.propTypes = {
  suite: PropTypes.object,
  className: PropTypes.string,
  enableChart: PropTypes.bool,
  enableCode: PropTypes.bool,
};

export default Suite;
