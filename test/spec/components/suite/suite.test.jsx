import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Suite from 'components/suite/suite';
import SuiteSummary from 'components/suite/summary';
import SuiteChart from 'components/suite/chart';
import SuiteList from 'components/suite/list';
import TestList from 'components/test/list';

import basicSuite from 'sample-data/suite.json';
import nestedSuite from 'sample-data/test-data.json';

chai.use(chaiEnzyme());

describe('<Suite />', () => {
  let props;
  const getInstance = instanceProps => {
    const wrapper = shallow(<Suite { ...instanceProps } />);
    return {
      wrapper,
      chart: wrapper.find(SuiteChart),
      summary: wrapper.find(SuiteSummary),
      testList: wrapper.find(TestList),
      suiteList: wrapper.find(SuiteList)
    };
  };

  beforeEach(() => {
    props = {
      className: 'test',
      enableChart: true
    };
  });

  it('renders basic suite', () => {
    const instProps = Object.assign({}, props, {
      suite: basicSuite
    });
    const { chart, summary, testList } = getInstance(instProps);
    expect(chart).to.have.lengthOf(1);
    expect(summary).to.have.lengthOf(1);
    expect(testList).to.have.lengthOf(1);
  });

  it('renders basic suite without title or filename', () => {
    const newSuite = Object.assign({}, basicSuite, {
      title: '',
      file: ''
    });
    const instProps = Object.assign({}, props, {
      suite: newSuite
    });
    const { wrapper } = getInstance(instProps);
    expect(wrapper.find('.suite-title')).to.have.lengthOf(0);
    expect(wrapper.find('.suite-filename')).to.have.lengthOf(0);
  });

  it('renders basic suite without chart', () => {
    const instProps = Object.assign({}, props, {
      suite: basicSuite,
      enableChart: false
    });
    const { chart, summary, testList } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(1);
    expect(testList).to.have.lengthOf(1);
  });

  it('renders root suite', () => {
    const instProps = Object.assign({}, props, {
      suite: nestedSuite.suites
    });
    const { chart, summary, testList, suiteList } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(0);
    expect(suiteList).to.have.lengthOf(1);
  });
});
