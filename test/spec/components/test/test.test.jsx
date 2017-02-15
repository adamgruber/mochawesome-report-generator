/* eslint-disable max-len, no-useless-escape */
import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import { Test, CodeSnippet, TestContext } from 'components/test';

chai.use(chaiEnzyme());

const passingTest = {
  title: 'should be passing test if true is not false',
  fullTitle: 'Master Test Suite Test Suite - Basic should be passing test if true is not false',
  timedOut: false,
  duration: 1,
  state: 'passed',
  speed: 'medium',
  pass: true,
  fail: false,
  pending: false,
  code: 'true.should.be.ok;\ndone();',
  err: {},
  isRoot: false,
  uuid: '5c3ec47f-307f-4a35-b77a-d0d218acbc4d',
  parentUUID: '17bc6546-127d-4fc2-84b7-4aa033a8d2d3',
  skipped: false
};

const passingTestWithContext = {
  title: 'should be passing test if true is not false',
  fullTitle: 'Master Test Suite Test Suite - Basic should be passing test if true is not false',
  timedOut: false,
  duration: 1,
  state: 'passed',
  speed: 'medium',
  pass: true,
  fail: false,
  pending: false,
  code: 'true.should.be.ok;\ndone();',
  err: {},
  isRoot: false,
  uuid: '5c3ec47f-307f-4a35-b77a-d0d218acbc4d',
  parentUUID: '17bc6546-127d-4fc2-84b7-4aa033a8d2d3',
  skipped: false,
  context: "\'sample context\'"
};

const failingTest = {
  title: 'should fail when returned object does not match expected object',
  fullTitle: 'Master Test Suite Test Suite - Basic should fail when returned object does not match expected object',
  timedOut: false,
  duration: 11,
  state: 'failed',
  pass: false,
  fail: true,
  pending: false,
  code: 'var o = retObj();\no.should.eql({});\ndone();',
  err: {
    name: 'AssertionError',
    actual: '{\n  \"employees\": {\n    \"employee\": [\n      {\n        \"firstName\": \"Tom\"\n        \"id\": \"1\"\n        \"lastName\": \"Cruise\"\n      }\n      {\n        \"firstName\": \"Maria\"\n        \"id\": \"2\"\n        \"lastName\": \"Sharapova\"\n      }\n      {\n        \"firstName\": \"James\"\n        \"id\": \"3\"\n        \"lastName\": \"Bond\"\n      }\n    ]\n  }\n}',
    expected: '{}',
    operator: 'to equal',
    message: 'expected { employees: \n   { employee: \n      [ { id: \'1\', firstName: \'Tom\', lastName: \'Cruise\' },\n        { id: \'2\', firstName: \'Maria\', lastName: \'Sharapova\' },\n        { id: \'3\', firstName: \'James\', lastName: \'Bond\' } ] } } to equal {}',
    generatedMessage: true,
    showDiff: true,
    estack: 'AssertionError: expected { employees: \n   { employee: \n      [ { id: \'1\', firstName: \'Tom\', lastName: \'Cruise\' },\n        { id: \'2\', firstName: \'Maria\', lastName: \'Sharapova\' },\n        { id: \'3\', firstName: \'James\', lastName: \'Bond\' } ] } } to equal {}\n    at Assertion.prop.(anonymous function) (node_modules/should/lib/should.js:61:14)\n    at Context.<anonymous> (test-functional/test.js:38:16)',
    diff: '- {\n-   \"employees\": {\n-     \"employee\": [\n-       {\n-         \"firstName\": \"Tom\"\n-         \"id\": \"1\"\n-         \"lastName\": \"Cruise\"\n-       }\n-       {\n-         \"firstName\": \"Maria\"\n-         \"id\": \"2\"\n-         \"lastName\": \"Sharapova\"\n-       }\n-       {\n-         \"firstName\": \"James\"\n-         \"id\": \"3\"\n-         \"lastName\": \"Bond\"\n-       }\n-     ]\n-   }\n- }\n+ {}\n'
  },
  isRoot: false,
  uuid: '9624c695-05c7-4042-9cda-e251d27be2fe',
  parentUUID: '17bc6546-127d-4fc2-84b7-4aa033a8d2d3',
  skipped: false
};

const pendingTest = {
  title: 'pending test',
  fullTitle: 'Master Test Suite Test Suite - Failed After pending test',
  timedOut: false,
  duration: 0,
  pass: false,
  fail: false,
  pending: true,
  code: '',
  err: {},
  isRoot: false,
  uuid: '500aaaaf-368e-44ea-8db9-8fd21027884d',
  parentUUID: '4eacd25f-1878-4a61-9625-734c93726e4b',
  skipped: false
};

const skippedTest = {
  title: 'passing test',
  fullTitle: 'Master Test Suite Test Suite - Failed Before passing test',
  timedOut: false,
  duration: 0,
  pass: false,
  fail: false,
  pending: false,
  code: 'true.should.be.ok;\ndone();',
  err: {},
  isRoot: false,
  parentUUID: 'a3418f88-b249-4e88-8a58-5379690000ae',
  skipped: true
};

describe('<Test />', () => {
  let toggleSpy;
  let setStateSpy;
  const getInstance = instanceProps => {
    const wrapper = shallow(<Test { ...instanceProps } />);
    return {
      wrapper,
      snippets: wrapper.find(CodeSnippet),
      errorMsg: wrapper.find('.test-error-message'),
      ctx: wrapper.find(TestContext)
    };
  };

  beforeEach(() => {
    toggleSpy = sinon.spy(Test.prototype, 'toggleExpandedState');
    setStateSpy = sinon.spy(Test.prototype, 'setState');
  });

  afterEach(() => {
    toggleSpy.restore();
    setStateSpy.restore();
  });

  it('renders passing test', () => {
    const { wrapper, snippets, errorMsg, ctx } = getInstance({ test: passingTest });
    expect(snippets).to.have.lengthOf(3);
    expect(errorMsg).to.have.lengthOf(0);
    expect(ctx).to.have.lengthOf(0);
    wrapper.simulate('click');
    expect(toggleSpy.calledOnce).to.equal(true);
    expect(setStateSpy.calledOnce).to.equal(true);
  });

  it('renders passing test with context', () => {
    const { wrapper, snippets, errorMsg, ctx } = getInstance({ test: passingTestWithContext });
    expect(snippets).to.have.lengthOf(3);
    expect(errorMsg).to.have.lengthOf(0);
    expect(ctx).to.have.lengthOf(1);
    wrapper.simulate('click');
    expect(toggleSpy.calledOnce).to.equal(true);
    expect(setStateSpy.calledOnce).to.equal(true);
  });

  it('renders passing test, enableCode: false', () => {
    const { wrapper, snippets, errorMsg } = getInstance({ test: passingTest, enableCode: false });
    expect(snippets).to.have.lengthOf(2);
    expect(errorMsg).to.have.lengthOf(0);
    wrapper.simulate('click');
    expect(toggleSpy.calledOnce).to.equal(true);
    expect(setStateSpy.calledOnce).to.equal(false);
  });

  it('renders passing test with context, enableCode: false', () => {
    const { wrapper, snippets, errorMsg } = getInstance({ test: passingTestWithContext, enableCode: false });
    expect(snippets).to.have.lengthOf(2);
    expect(errorMsg).to.have.lengthOf(0);
    wrapper.simulate('click');
    expect(toggleSpy.calledOnce).to.equal(true);
    expect(setStateSpy.calledOnce).to.equal(true);
  });

  it('renders failing test', () => {
    const { wrapper, snippets, errorMsg } = getInstance({ test: failingTest });
    expect(snippets).to.have.lengthOf(3);
    expect(errorMsg).to.have.lengthOf(1);
    wrapper.simulate('click');
    expect(toggleSpy.calledOnce).to.equal(true);
    expect(setStateSpy.calledOnce).to.equal(true);
  });

  it('renders pending test', () => {
    const { wrapper, snippets, errorMsg } = getInstance({ test: pendingTest });
    expect(snippets).to.have.lengthOf(3);
    expect(errorMsg).to.have.lengthOf(0);
    wrapper.simulate('click');
    expect(toggleSpy.calledOnce).to.equal(true);
    expect(setStateSpy.called).to.equal(false);
  });

  it('renders skipped test', () => {
    const { wrapper, snippets, errorMsg } = getInstance({ test: skippedTest });
    expect(snippets).to.have.lengthOf(3);
    expect(errorMsg).to.have.lengthOf(0);
    wrapper.simulate('click');
    expect(toggleSpy.calledOnce).to.equal(true);
    expect(setStateSpy.called).to.equal(false);
  });
});
