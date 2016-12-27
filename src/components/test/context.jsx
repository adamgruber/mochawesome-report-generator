import React, { Component, PropTypes } from 'react';
import { CodeSnippet } from 'components/test';
import isString from 'lodash/isString';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const imgRegEx = /(?:png|jpe?g|gif)$/i;
const protocolRegEx = /^(?:(?:https?|ftp):\/\/)/i;
const urlRegEx = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/ // eslint-disable-line

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

  renderLink = (url, title) => {
    const isImage = imgRegEx.test(url);
    const hasProtocol = protocolRegEx.test(url);
    const cxname = isImage ? 'image-link' : 'text-link';
    const linkUrl = `${hasProtocol ? '' : 'http://'}${url}`;
    return (
      <a
        href={ linkUrl }
        className={ cx(cxname) }
        rel='noopener noreferrer'
        target='_blank'
        alt={ title } >
        { isImage
          ? <img src={ linkUrl } className={ cx('image') } role='presentation' />
          : url
        }
      </a>
    );
  };

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
          { urlRegEx.test(ctx)
            ? this.renderLink(ctx)
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
          { urlRegEx.test(val)
            ? this.renderLink(val, title)
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
