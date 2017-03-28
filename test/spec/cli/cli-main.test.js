/* eslint-disable import/no-extraneous-dependencies */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import testData from 'sample-data/test-data.json';

proxyquire.noCallThru();

const createStub = sinon.stub();
const cli = proxyquire('../../../bin/src/cli-main', {
  '../lib/main': {
    create: createStub
  }
});

const sharedOpts = {
  reportTitle: 'mochawesome',
  reportPageTitle: 'mochawesome-report',
  inlineAssets: false,
  enableCharts: true,
  enableCode: true,
  autoOpen: false,
  overwrite: true,
  timestamp: false,
  dev: false
};

const inOpts = Object.assign({}, sharedOpts, {
  reportFilename: 'mochawesome',
  reportDir: 'mochawesome-report'
});

const expectedOpts = Object.assign({}, inOpts, {
  reportHtmlFile: 'mochawesome-report/mochawesome.html'
});

beforeEach(() => {
  createStub.resolves(expectedOpts.reportHtmlFile);
});

afterEach(() => {
  createStub.reset();
});

describe('bin/cli', () => {
  it('should generate a report', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/test-data.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(undefined);
    expect(createStub.calledWithExactly(testData, args)).to.equal(true);
  });

  it('should not generate a report when no data is passed', () => {
    cli();
    expect(process.exitCode).to.equal(1);
    expect(createStub.called).to.equal(false);
  });

  it('should not generate a report when data file is not found', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/not-found.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createStub.called).to.equal(false);
  });

  it('should not generate a report when data is bad json', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/bad.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createStub.called).to.equal(false);
  });

  it('should not generate a report when a data error occurs', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createStub.called).to.equal(false);
  });

  it('should not generate a report when data schema is invalid', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/test-data-invalid.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createStub.called).to.equal(false);
  });

  it('should handle when create fails', () => {
    createStub.rejects();
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/test-data.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createStub.called).to.equal(true);
  });
});
