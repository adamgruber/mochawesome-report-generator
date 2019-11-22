import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import QuickSummary from 'components/quick-summary';

chai.use(chaiEnzyme());

describe('<QuickSummary />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = shallow(<QuickSummary {...instanceProps} />);
    return {
      wrapper,
      lists: wrapper.find('.quick-summary-list'),
      filterBtns: wrapper.find('button'),
    };
  };

  beforeEach(() => {
    props = {
      onQuickFilterClick: sinon.spy(),
      singleFilter: null,
      stats: {
        duration: 532,
        suites: 14,
        testsRegistered: 27,
        passes: 9,
        failures: 5,
        pending: 5,
        skipped: 8,
      },
    };
  });

  it('renders with all items', () => {
    const { lists } = getInstance(props);
    expect(lists).to.have.lengthOf(2);
    expect(lists.at(0).find('.quick-summary-item')).to.have.lengthOf(3);
    expect(lists.at(1).find('.quick-summary-item')).to.have.lengthOf(4);
  });

  it('renders without pending or skipped', () => {
    props.stats.pending = 0;
    props.stats.skipped = 0;
    const { lists } = getInstance(props);
    expect(lists).to.have.lengthOf(2);
    expect(lists.at(0).find('.quick-summary-item')).to.have.lengthOf(3);
    expect(lists.at(1).find('.quick-summary-item')).to.have.lengthOf(2);
  });

  it('renders with `singleFilter` set', () => {
    props.singleFilter = 'showPassed';
    const { lists } = getInstance(props);
    expect(lists.at(1)).to.have.className('single-filter');
    expect(lists.at(1)).to.have.className('single-filter--passed');
  });

  describe('quick filters', () => {
    it('should call `onQuickFilterClick` with expected argument', () => {
      const { filterBtns } = getInstance(props);
      const filters = ['showPassed', 'showFailed', 'showPending', 'showSkipped'];
      filterBtns.forEach((btn, i) => {
        btn.simulate('click');
        expect(props.onQuickFilterClick.getCall(i).args[0]).to.equal(filters[i]);
      })
    });
  });

});
