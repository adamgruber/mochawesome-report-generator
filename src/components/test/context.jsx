import React, { Component, PropTypes } from 'react';
import { CodeSnippet } from 'components/test';
import isString from 'lodash/isString';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const imgRegEx = /https?:\/\/.*\.(?:png|jpg|gif|jpeg)/i;

class TestContext extends Component {
  static displayName = 'TestContext';

  static propTypes = {
    className: PropTypes.string,
    context: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array
    ])
  };

  renderImage = (url, title) => (
    <a
      href={ url }
      className={ cx('image-link') }
      rel='noopener noreferrer'
      target='_blank'
      alt={ title } >
      <img src={ url } className={ cx('image') } role='presentation' />
    </a>
  );

  renderContext = (ctx, i) => {
    const containerProps = {
      className: cx('context-item')
    };
    if (i !== undefined) {
      containerProps.key = i;
    }

    // Context is a simple string
    if (isString(ctx)) {
      return (
        <div { ...containerProps } >
          { imgRegEx.test(ctx)
            ? this.renderImage(ctx)
            : <CodeSnippet className={ cx('code-snippet') } code={ ctx } highlight={ false } />
          }
        </div>
      );
    }

    // Context is an object with title and value
    const { title, value } = ctx;
    /* istanbul ignore else */
    if (value) {
      const val = isString(value) ? value : JSON.stringify(value, null, 2);
      return (
        <div { ...containerProps } >
          <h4 className={ cx('context-item-title') }>{ title }:</h4>
          { imgRegEx.test(val)
            ? this.renderImage(val, title)
            : <CodeSnippet className={ cx('code-snippet') } code={ val } />
          }
        </div>
      );
    }

    return false;
  }

  render() {
    const { className, context } = this.props;

    // All context comes in stringified initially so we parse it here
    const ctx = JSON.parse(context);
    const isContextArray = Array.isArray(ctx);
    return (
      <div className={ cx(className, 'context') }>
        <h4 className={ cx('context-title') }>Additional Test Context</h4>
        { isContextArray
          ? ctx.map(this.renderContext)
          : this.renderContext(ctx)
        }
      </div>
    );
  }
}

export default TestContext;

