/* eslint-disable max-len */
import React, { PropTypes } from 'react';
import { Duration, Icon } from 'components';
import { CodeSnippet, TestContext } from 'components/test';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

class Test extends React.Component {
  constructor() {
    super();
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
  }

  static propTypes = {
    test: PropTypes.object,
    enableCode: PropTypes.bool
  }

  static defaultProps = {
    enableCode: true
  }

  state = {
    expanded: false
  }

  toggleExpandedState() {
    const { test, enableCode } = this.props;
    if ((enableCode && test.pass) || !!test.context || test.fail) {
      this.setState({ expanded: !this.state.expanded });
    }
  }

  render() {
    const { test, enableCode } = this.props;
    const { uuid, title, speed, duration, pass, fail, pending, skipped, err, code, context } = test;

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
      return <Icon name={ iconName } className={ cx('icon', iconClassName) } size={ 18 } />;
    };

    const cxname = cx('component', {
      expanded: this.state.expanded,
      passed: pass,
      failed: fail,
      pending,
      skipped,
      inactive: pending || skipped || (pass && !enableCode && !context),
      'with-context': !!context
    });

    return (
      <section id={ uuid } className={ cxname } onClick={ this.toggleExpandedState }>
        <header className={ cx('header') }>
          <div className={ cx('title-wrap') }>
            { testIcon() }
            <h4 className={ cx('title') }>{ title }</h4>
          </div>
          <div className={ cx('info') }>
            { !!context && <Icon name='chat_bubble_outline' className={ cx('context-icon') } size={ 18 } /> }
            <Duration className={ cx('duration') } timer={ duration } />
            <Icon name='timer' className={ cx('duration-icon', speed) } size={ 18 } />
          </div>
        </header>
        { !!err.name && !!err.message && (
          <p className={ cx('error-message') }>{ `${err.name}: ${err.message}` }</p>
        ) }
        <div className={ cx('body') }>
          { <CodeSnippet className={ cx('code-snippet') } code={ err.estack } highlight={ false } label='Stack Trace' /> }
          { <CodeSnippet className={ cx('code-snippet') } code={ err.diff } lang='diff' label='Diff' /> }
          { enableCode && <CodeSnippet className={ cx('code-snippet') } code={ code } label='Test Code' /> }
          { !!context && <TestContext context={ context } /> }
        </div>
      </section>
    );
  }
}

export default Test;
