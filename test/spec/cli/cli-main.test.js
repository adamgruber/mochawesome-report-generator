/* eslint-disable import/no-extraneous-dependencies */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import testData from 'sample-data/test-data.json';

proxyquire.noCallThru();

const createSyncSpy = sinon.spy();
const cli = proxyquire('../../../bin/src/cli-main', {
  '../lib/main': {
    createSync: createSyncSpy
  }
});

const sharedOpts = {
  reportTitle: 'mochawesome',
  reportPageTitle: 'mochawesome-report',
  inlineAssets: false,
  enableCharts: true,
  enableCode: true,
  dev: true
};

const inOpts = Object.assign({}, sharedOpts, {
  reportFilename: 'mochawesome',
  reportDir: 'mochawesome-report'
});

const expectedOpts = Object.assign({}, sharedOpts, {
  reportHtmlFile: 'mochawesome-report/mochawesome.html'
});

afterEach(() => {
  createSyncSpy.reset();
});

describe('bin/cli', () => {
  it('should generate a report', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/test-data.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(undefined);
    expect(createSyncSpy.calledWithExactly(testData, expectedOpts)).to.equal(true);
  });

  it('should not generate a report when no data is passed', () => {
    cli();
    expect(process.exitCode).to.equal(1);
    expect(createSyncSpy.called).to.equal(false);
  });

  it('should not generate a report when data file is not found', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/not-found.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createSyncSpy.called).to.equal(false);
  });

  it('should not generate a report when data is bad json', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/bad.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createSyncSpy.called).to.equal(false);
  });

  it('should not generate a report when a data error occurs', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createSyncSpy.called).to.equal(false);
  });
});
