import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import SuiteChart from 'components/suite/chart';
import Chartist from 'chartist';

chai.use(chaiEnzyme());

describe('<SuiteChart />', () => {
  const getInstance = instanceProps => mount(<SuiteChart {...instanceProps} />);

  beforeEach(() => {
    sinon.spy(Chartist, 'Pie');
  });

  afterEach(() => {
    Chartist.Pie.restore();
  });

  it('renders chart', () => {
    const props = {
      totalPasses: 8,
      totalFailures: 5,
      totalPending: 2,
      totalSkipped: 1,
    };
    getInstance(props);
    const chartData = Chartist.Pie.getCall(0).args[1];
    const chartOpts = Chartist.Pie.getCall(0).args[2];
    expect(chartData.series).to.deep.equal([8, 5, 2, 1]);
    expect(chartOpts).to.deep.equal({
      classNames: { sliceDonutSolid: 'suite-chart-slice' },
      chartPadding: 0,
      donut: true,
      donutSolid: true,
      donutWidth: 9,
      ignoreEmptyValues: true,
      showLabel: false,
      startAngle: 180,
    });
  });

  it('calls shouldComponentUpdate', () => {
    const props = {
      totalPasses: 8,
      totalFailures: 5,
      totalPending: 2,
      totalSkipped: 1,
    };
    const wrapper = getInstance(props);
    sinon.spy(SuiteChart.prototype, 'shouldComponentUpdate');
    wrapper.setProps({
      totalPasses: 9,
    });
    expect(SuiteChart.prototype.shouldComponentUpdate.calledOnce).to.equal(
      true
    );
  });
});
