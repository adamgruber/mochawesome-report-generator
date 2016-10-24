import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Report from 'components/report';
import reportStore from 'js/reportStore';
import testData from 'sample-data/test-data.json';

chai.use(chaiEnzyme());

reportStore.setInitialData({ data: testData, config: {} });

describe('<MochawesomeReport />', () => {
  it('should render', () => {
    sinon.spy(Report.prototype, 'componentDidMount');
    mount(<Report store={ reportStore } />);
    expect(Report.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});
