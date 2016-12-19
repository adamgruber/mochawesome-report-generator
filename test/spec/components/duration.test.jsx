import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Duration from 'components/duration';

chai.use(chaiEnzyme());

describe('<Duration />', () => {
  it('milliseconds', () => {
    const wrapper = shallow(<Duration timer={ 500 } />);
    expect(wrapper.text()).to.equal('500ms');
  });
  it('seconds', () => {
    const wrapper = shallow(<Duration timer={ 5000 } />);
    expect(wrapper.text()).to.equal('5.0s');
  });
  it('minutes', () => {
    const wrapper = shallow(<Duration timer={ 91234 } />);
    expect(wrapper.text()).to.equal('1:31.234m');
  });
  it('minutes with leading zeroes', () => {
    const wrapper = shallow(<Duration timer={ 61234 } />);
    expect(wrapper.text()).to.equal('1:01.234m');
  });
  it('hours', () => {
    const wrapper = shallow(<Duration timer={ 8531234 } />);
    expect(wrapper.text()).to.equal('2:22:11.234h');
  });
  it('hours with leading zeroes', () => {
    const wrapper = shallow(<Duration timer={ 7625134 } />);
    expect(wrapper.text()).to.equal('2:07:05.134h');
  });
  it('summary duration milliseconds', () => {
    const wrapper = shallow(<Duration timer={ 234 } isSummary />);
    expect(wrapper.text()).to.equal('234MS');
  });
  it('summary duration seconds', () => {
    const wrapper = shallow(<Duration timer={ 1234 } isSummary />);
    expect(wrapper.text()).to.equal('1.234S');
  });
  it('summary duration minutes', () => {
    const wrapper = shallow(<Duration timer={ 91234 } isSummary />);
    expect(wrapper.text()).to.equal('1:31M');
  });
  it('summary duration hours', () => {
    const wrapper = shallow(<Duration timer={ 7625134 } isSummary />);
    expect(wrapper.text()).to.equal('2:07H');
  });
});
