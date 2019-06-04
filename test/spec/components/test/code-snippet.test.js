/* eslint-disable global-require */
import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import CodeSnippet from 'components/test/code-snippet';
import hljs from 'highlight.js/lib/highlight';

chai.use(chaiEnzyme());

describe('<CodeSnippet />', () => {
  let node;

  const getInstance = instanceProps =>
    mount(<CodeSnippet {...instanceProps} />, { attachTo: node });

  beforeEach(() => {
    node = document.createElement('div');
    node.setAttribute('id', 'app');
    document.body.appendChild(node);
    hljs.registerLanguage(
      'javascript',
      require('highlight.js/lib/languages/javascript')
    );
    hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'));
  });

  afterEach(() => {
    document.getElementById('app').remove();
  });

  it('renders and highlights js snippet', () => {
    const props = {
      code: "function(){console.log('sample code');}",
    };
    const wrapper = getInstance(props);
    expect(wrapper.find('pre').hasClass('javascript')).to.equal(true);
    expect(document.querySelectorAll('.hljs-keyword').length).to.equal(1);
    expect(
      document.querySelectorAll('.test-code-diff-expected').length
    ).to.equal(0);
    expect(document.querySelectorAll('.test-code-diff-actual').length).to.equal(
      0
    );
  });

  it('renders and highlights diff snippet', () => {
    const props = {
      code: ' {\n-   "a": 2\n+   "a": 1\n }\n',
      lang: 'diff',
    };
    const wrapper = getInstance(props);
    expect(wrapper.find('pre').hasClass('diff')).to.equal(true);
    expect(wrapper.find('pre').hasClass('inline-diff')).to.equal(false);
    expect(
      document.querySelectorAll('.test-code-diff-expected').length
    ).to.equal(1);
    expect(document.querySelectorAll('.test-code-diff-actual').length).to.equal(
      1
    );
    expect(document.querySelectorAll('.hljs-addition').length).to.equal(3);
    expect(document.querySelectorAll('.hljs-deletion').length).to.equal(1);
  });

  it('renders and does not highlight inline diff snippet', () => {
    const props = {
      code: [
        { count: 6, value: '{\n  "a": ' },
        { count: 1, added: undefined, removed: true, value: '2' },
        { count: 1, added: true, removed: undefined, value: '1' },
        { count: 2, value: '\n}' },
      ],
      lang: 'diff',
    };
    const wrapper = getInstance(props, { useInlineDiffs: true });
    expect(wrapper.find('pre').hasClass('diff')).to.equal(false);
    expect(wrapper.find('pre').hasClass('inline-diff')).to.equal(true);
    expect(
      document.querySelectorAll('.test-code-diff-expected').length
    ).to.equal(2);
    expect(document.querySelectorAll('.test-code-diff-actual').length).to.equal(
      2
    );
  });

  it('does not highlight when prop is false', () => {
    const props = {
      code: "function(){console.log('sample code');}",
      highlight: false,
      lang: 'piglatin',
    };
    const wrapper = getInstance(props);
    expect(wrapper.hasClass('piglatin')).to.equal(false);
    expect(document.querySelectorAll('.hljs-keyword').length).to.equal(0);
  });

  it('renders label', () => {
    const props = {
      code: "function(){console.log('sample code');}",
      showLabel: true,
      label: 'code',
    };
    getInstance(props);
    expect(document.querySelectorAll('.test-code-label').length).to.equal(1);
  });

  it('does not render when code is not passed', () => {
    const wrapper = getInstance({});
    expect(wrapper.find('code')).to.have.lengthOf(0);
  });

  it('does not render HTML tags as markup', () => {
    const props = {
      code: '<strong class="tag--should-not-render">sample text</strong>',
    };
    getInstance(props);
    expect(
      document.querySelectorAll('.tag--should-not-render').length
    ).to.equal(0);
  });

  it('calls shouldComponentUpdate', () => {
    const props = {
      code: "function(){console.log('sample code');}",
    };
    const wrapper = getInstance(props);
    sinon.spy(CodeSnippet.prototype, 'shouldComponentUpdate');
    wrapper.setProps({
      highlight: false,
    });
    expect(CodeSnippet.prototype.shouldComponentUpdate.calledOnce).to.equal(
      true
    );
  });
});
