import t from 'tcomb-validation';
import { expect } from 'chai';
import { makeTest, makeSuite, makeReport } from './fixtures';
import * as types from '../src/bin/types';

const passed = makeTest('passed', { hook: 'beforeEach' });
const failed = makeTest('failed', { hook: 'after' });
const pending = makeTest('pending');
const skipped = makeTest('skipped');
const tests = { passed, failed, pending, skipped };

const suite = makeSuite({
  isRoot: true,
  suites: [
    makeSuite({
      hooks: [
        makeTest('passed', { hook: 'before' }),
        makeTest('passed', { hook: 'beforeEach' }),
        makeTest('passed', { hook: 'after' }),
        makeTest('passed', { hook: 'afterEach' }),
      ],
      tests: [makeTest('passed'), makeTest('failed')],
    }),
  ],
});

const suiteFailedBefore = makeSuite({
  isRoot: true,
  suites: [
    makeSuite({
      hooks: [
        makeTest('failed', { hook: 'before' }),
        makeTest('passed', { hook: 'beforeEach' }),
        makeTest('passed', { hook: 'after' }),
        makeTest('passed', { hook: 'afterEach' }),
      ],
      tests: [makeTest('passed'), makeTest('failed')],
    }),
  ],
});

const suiteFailedBeforeEach = makeSuite({
  isRoot: true,
  suites: [
    makeSuite({
      hooks: [
        makeTest('passed', { hook: 'before' }),
        makeTest('failed', { hook: 'beforeEach' }),
        makeTest('passed', { hook: 'after' }),
        makeTest('passed', { hook: 'afterEach' }),
      ],
      tests: [makeTest('passed'), makeTest('failed')],
    }),
  ],
});

const suiteFailedAfter = makeSuite({
  isRoot: true,
  suites: [
    makeSuite({
      hooks: [
        makeTest('passed', { hook: 'before' }),
        makeTest('passed', { hook: 'beforeEach' }),
        makeTest('failed', { hook: 'after' }),
        makeTest('passed', { hook: 'afterEach' }),
      ],
      tests: [makeTest('passed'), makeTest('failed')],
    }),
  ],
});

const suiteFailedAfterEach = makeSuite({
  isRoot: true,
  suites: [
    makeSuite({
      hooks: [
        makeTest('passed', { hook: 'before' }),
        makeTest('passed', { hook: 'beforeEach' }),
        makeTest('passed', { hook: 'after' }),
        makeTest('failed', { hook: 'afterEach' }),
      ],
      tests: [makeTest('passed'), makeTest('failed')],
    }),
  ],
});

describe('test fixtures', () => {
  Object.keys(tests).forEach(type => {
    it(`should validate test type: ${type}`, () => {
      const result = t.validate(tests[type], types.Test, { strict: true });
      const errMsgs = result.errors.map(err => err.message);
      expect(errMsgs).to.deep.equal([]);
      expect(result.isValid()).to.equal(true);
    });
  });
});

describe('suite fixtures', () => {
  it('should validate suite', () => {
    const result = t.validate(suite, types.Suite, { strict: true });
    const errMsgs = result.errors.map(err => err.message);
    expect(errMsgs).to.deep.equal([]);
    expect(result.isValid()).to.equal(true);
  });
});

describe('report stats', () => {
  function shouldMatchStats(
    stats,
    numSuites,
    numTests,
    numPasses,
    numPending,
    numFailures,
    numTestsReg,
    passPct,
    pendPct,
    numOther,
    numSkipped
  ) {
    expect(stats).to.have.property('suites', numSuites);
    expect(stats).to.have.property('tests', numTests);
    expect(stats).to.have.property('passes', numPasses);
    expect(stats).to.have.property('pending', numPending);
    expect(stats).to.have.property('failures', numFailures);
    expect(stats.start).to.be.a('string');
    expect(stats.end).to.be.a('string');
    expect(stats).to.have.property('testsRegistered', numTestsReg);
    expect(stats).to.have.property('passPercent', passPct);
    expect(stats).to.have.property('pendingPercent', pendPct);
    expect(stats).to.have.property('other', numOther);
    expect(stats.hasOther).to.equal(!!numOther);
    expect(stats).to.have.property('skipped', numSkipped);
    expect(stats.hasSkipped).to.equal(!!numSkipped);
  }

  it('should have expected stats', () => {
    const report = makeReport(suite);
    shouldMatchStats(report.stats, 1, 2, 1, 0, 1, 2, 50, 0, 0, 0);
  });

  it('should have expected stats - failed before', () => {
    const report = makeReport(suiteFailedBefore);
    shouldMatchStats(report.stats, 1, 0, 0, 0, 0, 2, 0, 0, 1, 2);
  });

  it('should have expected stats - failed beforeEach', () => {
    const report = makeReport(suiteFailedBeforeEach);
    shouldMatchStats(report.stats, 1, 0, 0, 0, 0, 2, 0, 0, 1, 2);
  });

  it('should have expected stats - failed after', () => {
    const report = makeReport(suiteFailedAfter);
    shouldMatchStats(report.stats, 1, 2, 1, 0, 1, 2, 50, 0, 1, 0);
  });

  it('should have expected stats - failed afterEach', () => {
    const report = makeReport(suiteFailedAfterEach);
    shouldMatchStats(report.stats, 1, 1, 1, 0, 0, 2, 50, 0, 1, 1);
  });
});

describe('report fixtures', () => {
  it('should validate report', () => {
    const report = makeReport(suite);
    const result = t.validate(report, types.TestReport, { strict: true });
    const errMsgs = result.errors.map(err => err.message);
    expect(errMsgs).to.deep.equal([]);
    expect(result.isValid()).to.equal(true);
  });
});
