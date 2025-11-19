/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Duration, Icon } from 'components';
import { CodeSnippet, TestContext } from 'components/test';
import classNames from 'classnames/bind';
import styles from './test.module.css';

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

  toggleExpandedState(e) {
    e.stopPropagation();
    const { test, enableCode } = this.props;

    if (
      (enableCode && test.pass) ||
      !!test.context ||
      test.fail ||
      test.isHook
    ) {
      this.setState({ expanded: e.target.open });
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

    const isInactive =
      !context && (pending || skipped || (pass && !enableCode));

    const cxname = cx('component', {
      expanded: this.state.expanded,
      passed: pass,
      failed: fail,
      pending,
      skipped,
      hook: isHook,
      inactive: isInactive,
      'with-context': !!context,
    });

    const { expanded } = this.state;

    return (
      <li id={uuid} className={cxname}>
        <details onToggle={this.toggleExpandedState} className={cx('details')}>
          <summary
            className={cx('header')}
            tabIndex={isInactive ? '-1' : undefined}>
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
            {!!err.message && (
              <p className={cx('error-message')}>{err.message}</p>
            )}
          </summary>

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
        </details>
      </li>
    );
  }
}

export default Test;
