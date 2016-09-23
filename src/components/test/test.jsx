import React, { PropTypes } from 'react';
import { CodeSnippet } from './';
import { Duration, Icon } from '../../components';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

class Test extends React.Component {
  static propTypes = {
    test: PropTypes.object
  }

  state = {
    expanded: false
  }

  toggleExpandedState = () => {
    if (!this.props.test.pending) {
      this.setState({ expanded: !this.state.expanded });
    }
  }

  render() {
    const { test } = this.props;
    const { uuid, title, speed, duration, pass, fail, pending, skipped, err, code } = test;

    const testIcon = () => {
      let iconName = 'check';
      let iconClassName = 'pass';
      if (fail) {
        iconName = 'close';
        iconClassName = 'fail';
      }
      if (pending) {
        iconName = 'pause';
        iconClassName = 'pending';
      }
      return <Icon name={ iconName } className={ cx('icon', iconClassName) } size={ 18 } />;
    };

    const cxname = cx('component', {
      expanded: this.state.expanded,
      passed: pass,
      failed: fail,
      pending,
      skipped
    });

    return (
      <section id={ uuid } className={ cxname } onClick={ this.toggleExpandedState }>
        <header className={ cx('header') }>
          <div className={ cx('title-wrap') }>
            { testIcon() }
            <h4 className={ cx('title') }>{ title }</h4>
          </div>
          <div className={ cx('info') }>
            <Duration className={ cx('duration') } timer={ duration } />
            <Icon name='timer' className={ cx('duration-icon', speed) } size={ 18 } />
          </div>
        </header>
        { !!err.name && !!err.message && (
          <p className={ cx('error-message') }>{ `${err.name}: ${err.message}` }</p>
        ) }
        <div className={ cx('body') }>
          { <CodeSnippet className={ cx('code-snippet') } code={ err.estack } lang='bash' /> }
          { <CodeSnippet className={ cx('code-snippet') } code={ err.diff } lang='diff' /> }
          { <CodeSnippet className={ cx('code-snippet') } code={ code } /> }
        </div>
      </section>
    );
  }
}

export default Test;
