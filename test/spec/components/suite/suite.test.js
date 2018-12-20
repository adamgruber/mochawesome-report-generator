import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Suite from 'components/suite/suite';
import SuiteSummary from 'components/suite/summary';
import SuiteChart from 'components/suite/chart';
import SuiteList from 'components/suite/list';
import TestList from 'components/test/list';

import { makeSuite, makeTest } from 'fixtures';

const basicSuite = makeSuite({
  tests: [makeTest('passed'), makeTest('failed')],
});

const hooksSuite = makeSuite({
  hooks: [
    makeTest('passed', { hook: 'before' }),
    makeTest('failed', { hook: 'after' }),
  ],
});

chai.use(chaiEnzyme());

describe('<Suite />', () => {
  let props;
  const getInstance = instanceProps => {
    const wrapper = shallow(<Suite {...instanceProps} />);
    return {
      wrapper,
      chart: wrapper.find(SuiteChart),
      summary: wrapper.find(SuiteSummary),
      testList: wrapper.find(TestList),
      suiteList: wrapper.find(SuiteList),
      header: wrapper.find('.suite-header'),
    };
  };

  beforeEach(() => {
    props = {
      className: 'test',
      enableChart: true,
    };
  });

  it('renders basic suite', () => {
    const instProps = Object.assign({}, props, {
      suite: basicSuite,
    });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(1);
    expect(summary).to.have.lengthOf(1);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(1);
  });

  it('renders basic suite without title or filename', () => {
    const newSuite = Object.assign({}, basicSuite, {
      title: '',
      file: '',
    });
    const instProps = Object.assign({}, props, {
      suite: newSuite,
    });
    const { wrapper } = getInstance(instProps);
    expect(wrapper.find('.suite-title')).to.have.lengthOf(0);
    expect(wrapper.find('.suite-filename')).to.have.lengthOf(0);
  });

  it('renders basic suite without chart', () => {
    const instProps = Object.assign({}, props, {
      suite: basicSuite,
      enableChart: false,
    });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(1);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(1);
  });

  it('renders a suite with only hooks', () => {
    const instProps = Object.assign({}, props, {
      suite: hooksSuite,
    });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(1);
  });

  it('renders a suite with only before hooks', () => {
    const suite = Object.assign({}, hooksSuite);
    suite.afterHooks = [];
    const instProps = Object.assign({}, props, { suite });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(1);
  });

  it('renders a suite with only after hooks', () => {
    const suite = Object.assign({}, hooksSuite);
    suite.beforeHooks = [];
    const instProps = Object.assign({}, props, { suite });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(1);
  });

  it('renders root suite with tests', () => {
    const suite = makeSuite({
      tests: [makeTest('passed')],
      isRoot: true,
    });
    const instProps = Object.assign({}, props, { suite });
    const { chart, summary, testList, suiteList, header } = getInstance(
      instProps
    );
    expect(chart).to.have.lengthOf(1);
    expect(summary).to.have.lengthOf(1);
    expect(testList).to.have.lengthOf(1);
    expect(suiteList).to.have.lengthOf(0);
    expect(header).to.have.lengthOf(1);
  });

  it('renders root suite without tests', () => {
    const suite = makeSuite({ isRoot: true });
    const instProps = Object.assign({}, props, { suite });
    const { chart, summary, testList, suiteList, header } = getInstance(
      instProps
    );
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(0);
    expect(suiteList).to.have.lengthOf(0);
    expect(header).to.have.lengthOf(0);
  });

  describe('shouldComponentUpdate', () => {
    let scuSpy;
    let initialSuite;
    let updatedSuite;

    beforeEach(() => {
      initialSuite = makeSuite({ tests: [makeTest('passed')] });
      updatedSuite = makeSuite({ tests: [makeTest('failed')] });
      scuSpy = sinon.spy(Suite.prototype, 'shouldComponentUpdate');
    });

    afterEach(() => {
      scuSpy.restore();
    });

    it('returns true when next props do not equal current props', () => {
      const instProps = Object.assign({}, props, {
        suite: initialSuite,
      });
      const { wrapper } = getInstance(instProps);
      wrapper.setProps({ suite: updatedSuite });
      expect(scuSpy.calledOnce).to.equal(true);
      expect(scuSpy.returned(true)).to.equal(true);
    });

    it('returns false when next props equal current props', () => {
      const instProps = Object.assign({}, props, {
        suite: initialSuite,
      });
      const { wrapper } = getInstance(instProps);
      wrapper.setProps({ suite: initialSuite });
      expect(scuSpy.calledOnce).to.equal(true);
      expect(scuSpy.returned(false)).to.equal(true);
    });
  });
});
