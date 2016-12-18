import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import CodeSnippet from 'components/test/code-snippet';

chai.use(chaiEnzyme());

describe('<CodeSnippet />', () => {
  let node;

  const getInstance = instanceProps => {
    const wrapper = mount(<CodeSnippet { ...instanceProps } />, {
      attachTo: node
    });
    return wrapper;
  };

  beforeEach(() => {
    node = document.createElement('div');
    node.setAttribute('id', 'app');
    document.body.appendChild(node);
  });

  afterEach(() => {
    document.getElementById('app').remove();
  });

  it('renders and highlights js snippet', () => {
    const props = {
      code: 'function(){console.log(\'sample code\');}'
    };
    getInstance(props);
    expect(document.querySelectorAll('.hljs-keyword').length).to.equal(1);
  });

  it('renders and highlights diff snippet', () => {
    const props = {
      code: 'function(){console.log(\'sample code\');}',
      lang: 'diff'
    };
    getInstance(props);
    expect(document.querySelectorAll('.test-code-diff-expected').length).to.equal(1);
    expect(document.querySelectorAll('.test-code-diff-actual').length).to.equal(1);
  });

  it('does not highlight when prop is false', () => {
    const props = {
      code: 'function(){console.log(\'sample code\');}',
      highlight: false
    };
    getInstance(props);
    expect(document.querySelectorAll('.hljs-keyword').length).to.equal(0);
  });

  it('renders label', () => {
    const props = {
      code: 'function(){console.log(\'sample code\');}',
      showLabel: true,
      label: 'code'
    };
    getInstance(props);
    expect(document.querySelectorAll('.test-code-label').length).to.equal(1);
  });

  it('does not render when code is not passed', () => {
    const wrapper = getInstance({});
    expect(wrapper).to.be.blank();
  });

  it('calls shouldComponentUpdate', () => {
    const props = {
      code: 'function(){console.log(\'sample code\');}'
    };
    const wrapper = getInstance(props);
    sinon.spy(CodeSnippet.prototype, 'shouldComponentUpdate');
    wrapper.setProps({
      highlight: false
    });
    expect(CodeSnippet.prototype.shouldComponentUpdate.calledOnce).to.equal(true);
  });
});
