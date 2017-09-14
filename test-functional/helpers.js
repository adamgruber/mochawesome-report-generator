/* eslint-disable no-console, no-undef */
import chai from 'chai';
import faker from 'faker';
import addContext from '../../mochawesome/addContext';

chai.should();

const exp = {
  foo: true,
  bar: false,
  baz: 1
};

const expWrong = {
  foo: true,
  bar: true,
  baz: 1
};

const chance = (pct, pass, fail = null) => Math.random() < pct ? pass : fail;

const createTest = (n = 1, opts = {}) => {
  const { forceContext, forceRun, forcePass, forcePend } = opts;
  for (let i = 0; i < n; i += 1) {
    const bool = forcePass || faker.random.boolean();
    const pend = forcePend || (forceRun ? false : chance(0.12, true, false));
    const shouldAddContext = forceContext || faker.random.boolean();
    const testMethod = pend ? xit : it;

    testMethod(`should be ${bool}`, function () {
      // true.should.eql(bool);
      exp.should.eql(bool ? exp : expWrong);
      shouldAddContext && addContext(this, 'context');
    });
  }
};

const createSuite = (n, nest) => {
  for (let i = 0; i < n; i += 1) {
    describe('Nested Suite', () => {
      createTest(faker.random.number({ min: 2, max: 5 }));
      const shouldNest = chance(0.7, true, false);
      if (nest || shouldNest) {
        createSuite({ min: 1, max: 3 });
      }
    });
  }
};

const createBefore = (shouldFail, title = '') => {
  before(`${title}`, () => {
    shouldFail
      ? console.log(a)
      : console.log('This is the before hook.');
  });
};

const createBeforeEach = (shouldFail, title = '') => {
  beforeEach(`${title}`, () => {
    shouldFail
      ? console.log(a)
      : console.log('This is the before each hook.');
  });
};

const createAfter = (shouldFail, title = '') => {
  after(`${title}`, () => {
    shouldFail
      ? console.log(a)
      : console.log('This is the after hook.');
  });
};

const createAfterEach = (shouldFail, title = '') => {
  afterEach(`${title}`, () => {
    shouldFail
      ? console.log(a)
      : console.log('This is the after each hook.');
  });
};

module.exports = {
  addContext,
  createTest,
  createSuite,
  createBefore,
  createBeforeEach,
  createAfter,
  createAfterEach
};
