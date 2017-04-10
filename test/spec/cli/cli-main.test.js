/* eslint-disable import/no-extraneous-dependencies */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import invalidTestData from 'sample-data/invalid.json';

proxyquire.noCallThru();

const createStub = sinon.stub();
const logger = {
  info: sinon.spy(),
  error: sinon.spy()
};
const cli = proxyquire('../../../bin/src/cli-main', {
  '../lib/main': {
    create: createStub
  },
  './logger': logger
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
  createStub.resolves([ expectedOpts.reportHtmlFile ]);
});

afterEach(() => {
  createStub.reset();
  logger.info.reset();
  logger.error.reset();
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
    expect(logger.error.args[0][0])
      .to.equal('The data file: test/sample-data/not-found.json could not be found.');
    expect(createStub.called).to.equal(false);
  });

  it('should not generate a report when data is bad json', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/bad.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(logger.error.args[0][0])
      .to.equal('There was a problem parsing mochawesome data. Please ensure the JSON file is valid.');
    expect(createStub.called).to.equal(false);
  });

  it('should not generate a report when a data error occurs', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(logger.error.args[0][0])
      .to.equal('There was a problem loading mochawesome data.');
    expect(createStub.called).to.equal(false);
  });

  it('should not generate a report when data schema is invalid', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/test-data-invalid.json' ]
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(logger.error.args[0][0].indexOf('There was a problem parsing mochawesome data:'))
      .to.equal(0);
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

  it('should set overwrite to false when timestamp option is passed', () => {
    const args = Object.assign({}, inOpts, {
      _: [ 'test/sample-data/test-data.json' ],
      timestamp: ''
    });

    cli(args);
    expect(process.exitCode).to.equal(1);
    expect(createStub.called).to.equal(true);
    expect(createStub.args[0][1]).to.have.property('overwrite', false);
  });
});
