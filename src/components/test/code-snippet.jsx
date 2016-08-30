import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js/lib/highlight';
import classNames from 'classnames';

class CodeSnippet extends Component {
  static propTypes = {
    className: PropTypes.any,
    code: PropTypes.string.isRequired,
    lang: PropTypes.string
  };

  static defaultProps = {
    lang: 'javascript'
  };

  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    const { lang } = this.props;
    const node = ReactDOM.findDOMNode(this);
    hljs.registerLanguage(lang, require(`highlight.js/lib/languages/${lang}`));
    hljs.highlightBlock(node);
  }

  render() {
    const { className, code, lang } = this.props;
    return (
      <pre className={ classNames(className, lang) }>
        <code dangerouslySetInnerHTML={ { __html: code } } />
      </pre>
    );
  }
}

export default CodeSnippet;
