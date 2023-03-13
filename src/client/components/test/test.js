/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Duration, Icon } from 'components';
import { CodeSnippet, TestContext } from 'components/test';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

class Test extends PureComponent {
  static propTypes = {
    test: PropTypes.object,
    enableCode: PropTypes.bool,
  };

  static defaultProps = {
    enableCode: true,
  };

  constructor() {
    super();
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
  }

  state = {
    expanded: false,
  };

  toggleExpandedState() {
    const { test, enableCode } = this.props;
    const { expanded } = this.state;
    if (
      (enableCode && test.pass) ||
      !!test.context ||
      test.fail ||
      test.isHook
    ) {
      this.setState({ expanded: !expanded });
    }
  }

  render() {
    const { test, enableCode } = this.props;
    const {
      uuid,
      title,
      speed,
      duration,
      pass,
      fail,
      flaky,
      pending,
      skipped,
      isHook,
      err,
      code,
      context,
    } = test;

    const testIcon = () => {
      let iconName;
      let iconClassName;
      if (pass) {
        iconName = 'check';
        iconClassName = 'pass';
      }
      if (fail) {
        iconName = 'close';
        iconClassName = 'fail';
      }
      if (flaky) {
        iconName = 'warning';
        iconClassName = 'flaky';
      }
      if (pending) {
        iconName = 'pause';
        iconClassName = 'pending';
      }
      if (skipped) {
        iconName = 'stop';
        iconClassName = 'skipped';
      }
      if (isHook) {
        if (fail) {
          iconName = 'error_outline';
        } else {
          iconName = title.match(/^"before/) ? 'rotate_left' : 'rotate_right';
        }
        iconClassName = 'hook';
      }
      return (
        <Icon
          name={iconName}
          className={cx('icon', iconClassName)}
          size={isHook ? 24 : 18}
        />
      );
    };

    const isInactive = !context && (pending || skipped || (pass && !enableCode));

    const cxname = cx('component', {
      expanded: this.state.expanded,
      passed: pass,
      failed: fail,
      flaky,
      pending,
      skipped,
      hook: isHook,
      inactive: isInactive,
      'with-context': !!context,
    });

    const { expanded } = this.state;

    return (
      <li id={uuid} className={cxname}>
        <header>
          <button
            aria-expanded={expanded}
            type="button"
            onClick={this.toggleExpandedState}
            disabled={isInactive}
            className={cx('header-btn')}>
            {testIcon()}
            <h4 className={cx('title')} title={title}>
              {title}
            </h4>
            <div className={cx('info')}>
              {!!context && (
                <Icon
                  name="chat_bubble_outline"
                  className={cx('context-icon')}
                  size={18}
                />
              )}
              {!isHook && (
                <Duration className={cx('duration')} timer={duration} />
              )}
              {!isHook && (
                <Icon
                  name="timer"
                  className={cx('duration-icon', speed)}
                  size={18}
                />
              )}
            </div>
            {!!err.message && <p className={cx('error-message')}>{err.message}</p>}
          </button>
        </header>
        {expanded && (
          <div className={cx('body-wrap')}>
            <div className={cx('body')}>
              {
                <CodeSnippet
                  className={cx('code-snippet')}
                  code={err.estack}
                  highlight={false}
                  label="Stack Trace"
                />
              }
              {
                <CodeSnippet
                  className={cx('code-snippet')}
                  code={err.diff}
                  lang="diff"
                  label="Diff"
                />
              }
              {enableCode && (
                <CodeSnippet
                  className={cx('code-snippet')}
                  code={code}
                  label="Test Code"
                />
              )}
              {!!context && <TestContext context={context} />}
            </div>
          </div>
        )}
      </li>
    );
  }
}

export default Test;
