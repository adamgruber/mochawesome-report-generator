/* eslint-disable import/no-dynamic-require, react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import hljs from 'highlight.js/lib/highlight';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

class CodeSnippet extends Component {
  static displayName = 'CodeSnippet';

  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    lang: PropTypes.string,
    highlight: PropTypes.bool,
    label: PropTypes.string,
    showLabel: PropTypes.bool,
  };

  static defaultProps = {
    lang: 'javascript',
    highlight: true,
    showLabel: false,
  };

  componentDidMount() {
    this.highlightCode();
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  shouldHighlight() {
    const { code, highlight, lang } = this.props;
    if (lang === 'diff' && isArray(code)) {
      return false;
    }
    return code && highlight;
  }

  highlightCode() {
    if (this.shouldHighlight()) {
      hljs.highlightBlock(this.node);
    }
  }

  render() {
    const { className, code, lang, label, showLabel } = this.props;
    const isDiff = lang === 'diff';
    const isInlineDiff = isDiff && isArray(code);
    const shouldHighlight = this.shouldHighlight();
    const cxName = cx(className, {
      [lang]: shouldHighlight,
      hljs: !shouldHighlight,
      'code-diff': isDiff,
      'inline-diff': isInlineDiff,
    });

    const renderLegendLeft = () =>
      isInlineDiff ? (
        <span className={cx('code-diff-actual')}>actual</span>
      ) : (
        <span className={cx('code-diff-expected')}>+ expected</span>
      );

    const renderLegendRight = () =>
      isInlineDiff ? (
        <span className={cx('code-diff-expected')}>{'expected\n\n'}</span>
      ) : (
        <span className={cx('code-diff-actual')}>{'- actual\n\n'}</span>
      );

    const mapInlineDiffCode = ({ added, removed, value }, i) => {
      if (added) {
        return (
          <span key={i} className={cx('code-diff-expected')}>
            {value}
          </span>
        );
      }

      if (removed) {
        return (
          <span key={i} className={cx('code-diff-actual')}>
            {value}
          </span>
        );
      }

      return value;
    };

    return (
      !!code && (
        <pre
          className={cxName}
          ref={node => {
            this.node = node;
          }}>
          <code>
            {isDiff && renderLegendLeft()}
            {isDiff && renderLegendRight()}
            {isInlineDiff ? code.map(mapInlineDiffCode) : code}
          </code>
          {!!label &&
            showLabel && <span className={cx('code-label')}>{label}</span>}
        </pre>
      )
    );
  }
}

export default CodeSnippet;
