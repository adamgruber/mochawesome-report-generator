import React, { PropTypes } from 'react';
import { formatDuration } from '../../utils';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const Test = (props) => {
  const { test } = props;
  const { uuid, title, speed, duration, pass, fail, pending, skipped, err, code } = test;

  const cxname = cx('component', 'list-group-item', {
    passed: pass,
    failed: fail,
    pending,
    skipped
  });

  return (
    <div id={ uuid } className={ cxname }>
      <div className={ cx('heading') }>
        <h4 className={ cx('title') }>{ title }</h4>
        { !pending && (
          <div className={ cx('pull-right') }>
            <button
              className={ cx('btn', 'btn-link', 'btn-sm', 'toggle-btn', 'toggle-code', 'collapsed') }
              data-toggle='collapse'
              data-target='#{{uuid}} > .test-code.collapse'>Code</button>
            <span className={ cx('duration', speed) }>{ formatDuration(duration) }</span>
          </div>)
        }
      </div>
      { !!err && (
        <p className={ cx('error-message') }>{ `${err.name}: ${err.message}` }
          <button
            className={ cx('btn', 'btn-link', 'btn-sm', 'toggle-btn', 'toggle-stack', 'collapsed') }
            data-toggle='collapse'
            data-target='#{{../uuid}} > .test-error-stack.collapse'>Stack</button>
        </p>)
      }
      <div className={ cx('code', 'collapse') }>
        <pre><code className={ cx('hljs', 'javascript', 'small') } dangerouslySetInnerHTML={ { __html: code } } /></pre>
      </div>
      { !!err && (
        <div className={ cx('error-stack', 'collapse') }>
          <pre><code className={ cx('hljs', 'small') } dangerouslySetInnerHTML={ { __html: err.stack } } /></pre>
        </div>)
      }
    </div>
  );
};

Test.propTypes = {
  test: PropTypes.object
};

export default Test;
