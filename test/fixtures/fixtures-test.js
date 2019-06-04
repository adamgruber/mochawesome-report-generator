import t from 'tcomb-validation';
import { expect } from 'chai';
import {
  makeTest,
  makeSuite,
  makeReport,
  parseSuite,
  PASSED,
  FAILED,
  BEFORE,
  BEFORE_EACH,
  AFTER,
  AFTER_EACH,
  FAILED_BEFORE,
  FAILED_BEFORE_EACH,
  FAILED_AFTER,
  FAILED_AFTER_EACH,
} from './index';
import * as types from '../../src/bin/types';

const passed = makeTest('passed', { hook: 'beforeEach' });
const failed = makeTest('failed', { hook: 'after' });
const pending = makeTest('pending');
const skipped = makeTest('skipped');
const tests = { passed, failed, pending, skipped };

const suite = [[BEFORE, BEFORE_EACH, AFTER, AFTER_EACH, PASSED, FAILED]];

const suiteFailedBefore = [
  [FAILED_BEFORE, BEFORE_EACH, AFTER, AFTER_EACH, PASSED, FAILED],
];

const suiteFailedBeforeEach = [
  [BEFORE, FAILED_BEFORE_EACH, AFTER, AFTER_EACH, PASSED, FAILED],
];

const suiteFailedAfter = [
  [BEFORE, BEFORE_EACH, FAILED_AFTER, AFTER_EACH, PASSED, FAILED],
];

const suiteFailedAfterEach = [
  [BEFORE, BEFORE_EACH, AFTER, FAILED_AFTER_EACH, PASSED, FAILED],
];

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
    const parsed = makeSuite(parseSuite(suite));
    const result = t.validate(parsed, types.Suite, { strict: true });
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
