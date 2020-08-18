import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Duration from 'components/duration';

chai.use(chaiEnzyme());

describe('<Duration />', () => {
  it('milliseconds', () => {
    const wrapper = shallow(<Duration timer={500} />);
    expect(wrapper.text()).to.equal('500ms');
  });
  it('seconds', () => {
    const wrapper = shallow(<Duration timer={5000} />);
    expect(wrapper.text()).to.equal('5s');
  });
  it('minutes', () => {
    const wrapper = shallow(<Duration timer={91234} />);
    expect(wrapper.text()).to.equal('1m 31.2s');
  });
  it('minutes with leading zeroes', () => {
    const wrapper = shallow(<Duration timer={61234} />);
    expect(wrapper.text()).to.equal('1m 1.2s');
  });
  it('hours', () => {
    const wrapper = shallow(<Duration timer={8531234} />);
    expect(wrapper.text()).to.equal('2h 22m 11.2s');
  });
  it('hours with leading zeroes', () => {
    const wrapper = shallow(<Duration timer={7625134} />);
    expect(wrapper.text()).to.equal('2h 7m 5.1s');
  });
  it('days', () => {
    const wrapper = shallow(<Duration timer={123456789} />);
    expect(wrapper.text()).to.equal('1d 10h 17m');
  });
  it('summary duration milliseconds', () => {
    const wrapper = shallow(<Duration timer={234} isSummary />);
    expect(wrapper.text()).to.equal('234ms');
  });
  it('summary duration seconds', () => {
    const wrapper = shallow(<Duration timer={1234} isSummary />);
    expect(wrapper.text()).to.equal('1.2s');
  });
  it('summary duration minutes', () => {
    const wrapper = shallow(<Duration timer={91234} isSummary />);
    expect(wrapper.text()).to.equal('1m 31.2s');
  });
  it('summary duration hours', () => {
    const wrapper = shallow(<Duration timer={7625134} isSummary />);
    expect(wrapper.text()).to.equal('2h 7m 5.1s');
  });
  it('summary duration days', () => {
    const wrapper = shallow(<Duration timer={123456789} isSummary />);
    expect(wrapper.text()).to.equal('1d 10h 17m');
  });
});
