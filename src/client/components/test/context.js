import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CodeSnippet } from 'components/test';
import isString from 'lodash/isString';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const videoRegEx = /(?:mp4|webm)$/i;
const imgRegEx = /(?:png|jpe?g|gif)$/i;
const protocolRegEx = /^(?:(?:https?|ftp):\/\/)/i;
const urlRegEx = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/; // eslint-disable-line
const base64ImgRegEx = /^data:image\/([a-zA-Z0-9-_.])+;base64,([^"]*)$/i;

const isVideo = str => {
  if (!isString(str)) {
    return false;
  }

  const hashIndex = str.indexOf('#');
  return videoRegEx.test(hashIndex > 0 ? str.slice(0, hashIndex) : str);
}

class TestContext extends Component {
  static displayName = 'TestContext';

  static propTypes = {
    className: PropTypes.string,
    context: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
    ]),
  };

  renderVideo = (ctx, title) => {
    const isUrl = urlRegEx.test(ctx);
    const hasProtocol = protocolRegEx.test(ctx);
    const linkUrl = isUrl && !hasProtocol ? `http://${ctx}` : ctx;

    return (
      <video controls src={linkUrl} className={cx('video')}>
        <track kind="captions" />
        {title}
        <a
          href={linkUrl}
          className={cx('video-link')}
          rel="noopener noreferrer"
          target="_blank">
          {linkUrl}
        </a>
      </video>
    );
  };

  renderImage = (ctx, title) => {
    const isUrl = urlRegEx.test(ctx);
    const hasProtocol = protocolRegEx.test(ctx);
    const linkUrl = isUrl && !hasProtocol ? `http://${ctx}` : ctx;
    return (
      <a
        href={linkUrl}
        className={cx('image-link')}
        rel="noopener noreferrer"
        target="_blank">
        <img src={linkUrl} className={cx('image')} alt={title} />
      </a>
    );
  };

  renderBase64Image = (ctx, title) => (
    <img src={ctx} className={cx('image')} alt={title} />
  );

  renderLink = (url, title) => {
    const linkUrl = `${protocolRegEx.test(url) ? '' : 'http://'}${url}`;
    return (
      <a
        href={linkUrl}
        className={cx('text-link')}
        rel="noopener noreferrer"
        target="_blank"
        alt={title}>
        {url}
      </a>
    );
  };

  renderContextContent = (content, title, highlight = false) => {
    // Videos
    if (isVideo(content)) {
      return this.renderVideo(content, title);
    }

    // Images
    if (imgRegEx.test(content)) {
      return this.renderImage(content, title);
    }

    // Base64 Images
    if (base64ImgRegEx.test(content)) {
      return this.renderBase64Image(content, title);
    }

    // URLs
    if (urlRegEx.test(content)) {
      return this.renderLink(content, title);
    }

    // Simple string
    if (isString(content)) {
      return (
        <CodeSnippet
          className={cx('code-snippet')}
          code={content}
          highlight={false}
        />
      );
    }

    // All other types (primitives, objects, arrays...)
    const code = JSON.stringify(content, null, 2);
    return (
      <CodeSnippet
        className={cx('code-snippet')}
        code={code}
        highlight={highlight}
      />
    );
  };

  renderContext = (ctx, i) => {
    const containerProps = {
      className: cx('context-item'),
    };
    if (i !== undefined) {
      containerProps.key = i;
    }

    // Context is a simple string
    if (isString(ctx)) {
      return <div {...containerProps}>{this.renderContextContent(ctx)}</div>;
    }

    // Context is an object with title and value
    const { title, value } = ctx;
    return (
      <div {...containerProps}>
        <h4 className={cx('context-item-title')}>{title}:</h4>
        {this.renderContextContent(value, title, true)}
      </div>
    );
  };

  render() {
    const { className, context } = this.props;

    // All context comes in stringified initially so we parse it here
    const ctx = JSON.parse(context);
    return (
      <div className={cx(className, 'context')}>
        <h4 className={cx('context-title')}>Additional Test Context</h4>
        {Array.isArray(ctx)
          ? ctx.map(this.renderContext)
          : this.renderContext(ctx)}
      </div>
    );
  }
}

export default TestContext;
