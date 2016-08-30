import React, { PropTypes } from 'react';
import { CodeSnippet } from './';
import { formatDuration } from '../../utils';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const Test = (props) => {
  const { test } = props;
  const { uuid, title, speed, duration, pass, fail, pending, skipped, err, code } = test;

  const cxname = cx('component', {
    passed: pass,
    failed: fail,
    pending,
    skipped
  });

  return (
    <section id={ uuid } className={ cxname }>
      <header className={ cx('header') }>
        <h4 className={ cx('title') }>{ title }</h4>
        <div className={ cx('info') }>
          <div className={ cx('actions') }>
            <button className={ cx('btn') }>Code</button>
            <button className={ cx('btn') }>Error</button>
            <button className={ cx('btn') }>Diff</button>
            <button className={ cx('btn') }>Extra</button>
          </div>
          <span className={ cx('duration', speed) }>{ formatDuration(duration) }</span>
        </div>
      </header>
      { !!err && <p className={ cx('error-message') }>{ `${err.name}: ${err.message}` }</p> }
      { !!code && (
        <div className={ cx('code') }>
          <CodeSnippet className={ cx('code-snippet') } code={ code } />
        </div>)
      }
      { !!err && (
        <div className={ cx('error-stack') }>
          <CodeSnippet className={ cx('code-snippet') } code={ err.stack } lang='bash' />
        </div>)
      }
    </section>
  );
};

Test.propTypes = {
  test: PropTypes.object
};

export default Test;
