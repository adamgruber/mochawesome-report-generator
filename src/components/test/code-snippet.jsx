/* eslint-disable import/no-dynamic-require, react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import hljs from 'highlight.js/lib/highlight';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

class CodeSnippet extends Component {
  static displayName = 'CodeSnippet';

  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string,
    lang: PropTypes.string,
    highlight: PropTypes.bool,
    label: PropTypes.string,
    showLabel: PropTypes.bool
  };

  static defaultProps = {
    lang: 'javascript',
    highlight: true,
    showLabel: false
  };

  componentDidMount() {
    this.highlightCode();
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  highlightCode() {
    const { code, highlight } = this.props;
    if (highlight && code) {
      hljs.highlightBlock(this.node);
    }
  }

  render() {
    const { className, code, lang, highlight, label, showLabel } = this.props;
    const cxName = cx(className, lang, { hljs: !highlight });
    const isDiff = lang === 'diff';

    return !!code && (
      <pre className={ cxName } ref={ node => (this.node = node) }>
        <code>
          { isDiff && <span className={ cx('code-diff-expected') }>+ expected&nbsp;&nbsp;</span> }
          { isDiff && <span className={ cx('code-diff-actual') }>{'- actual\n\n'}</span> }
          { code }
        </code>
        { !!label && showLabel && <span className={ cx('code-label') }>{ label }</span> }
      </pre>
    );
  }
}

export default CodeSnippet;
