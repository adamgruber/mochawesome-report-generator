import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash/isEqual';
import hljs from 'highlight.js/lib/highlight';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

class CodeSnippet extends Component {
  static propTypes = {
    className: PropTypes.any,
    code: PropTypes.string,
    lang: PropTypes.string,
    highlight: PropTypes.bool
  };

  static defaultProps = {
    lang: 'javascript',
    highlight: true
  };

  componentDidMount() {
    this.highlightCode();
  }

  shouldComponentUpdate = nextProps => !isEqual(this.props, nextProps)

  highlightCode() {
    const { code, lang, highlight } = this.props;
    if (highlight && code) {
      const node = ReactDOM.findDOMNode(this);
      hljs.registerLanguage(lang, require(`highlight.js/lib/languages/${lang}`));
      hljs.highlightBlock(node);
    }
  }

  render() {
    const { className, code, lang, highlight } = this.props;
    let codeHtml = code;

    // Add - expected + actual to top of diffs
    if (lang === 'diff') {
      const expected = `<span class='${cx('code-diff-expected')}'>- expected</span>`;
      const actual = `<span class='${cx('code-diff-actual')}'>+ actual</span>`;
      codeHtml = `${expected}&nbsp;&nbsp;${actual}\n\n${code}`;
    }

    return !!code && (
      <pre className={ classNames(className, lang, { hljs: !highlight }) }>
        <code dangerouslySetInnerHTML={ { __html: codeHtml } } />
      </pre>
    );
  }
}

export default CodeSnippet;
