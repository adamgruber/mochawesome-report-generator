import React from 'react';
import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Report from 'components/report.jsx';
import reportStore from 'js/reportStore';
import testData from 'sample-data/test-data.json';

chai.use(chaiEnzyme());

reportStore.setInitialData({ data: testData, config: {} });

describe('<MochawesomeReport />', () => {
  it('should render', () => {
    sinon.spy(Report.prototype, 'componentDidMount');
    const wrapper = mount(<Report store={ reportStore } />);
    expect(Report.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});
