/* eslint-disable import/no-extraneous-dependencies */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import testData from 'sample-data/test-data.json';

chai.use(chaiAsPromised);
proxyquire.noCallThru();

const outputFileStub = sinon.stub();
const outputFileSyncStub = sinon.stub();
const copySyncStub = sinon.stub();
const readFileSyncStub = sinon.stub();
const openerStub = sinon.stub();
const existsSyncStub = sinon.stub();
const mareport = proxyquire('../../../lib/src/main', {
  'fs-extra': {
    outputFile: outputFileStub,
    outputFileSync: outputFileSyncStub,
    copySync: copySyncStub,
    readFileSync: readFileSyncStub,
    existsSync: existsSyncStub
  },
  opener: openerStub
});

const baseOpts = {
  reportHtmlFile: 'mochawesome-report/test.html',
  reportTitle: 'mochawesome',
  reportPageTitle: 'mochawesome-report',
  inlineAssets: false,
  enableCharts: true,
  enableCode: true,
  dev: true
};

let opts;

beforeEach(() => {
  opts = Object.assign({}, baseOpts);
});

afterEach(() => {
  outputFileStub.reset();
  outputFileSyncStub.reset();
  copySyncStub.reset();
  readFileSyncStub.reset();
});

describe('lib/main', () => {
  it('runs create', () => {
    outputFileStub.yields(null);
    return expect(mareport.create(testData, opts)).to.be.fulfilled;
  });

  it('runs create with autoOpen', () => {
    opts.autoOpen = true;
    outputFileStub.yields(null);
    return mareport.create(testData, opts).then(() => {
      expect(openerStub.called).to.equal(true);
    });
  });

  it('runs create and throws', () => {
    outputFileStub.yields('save error');
    return expect(mareport.create(testData, opts)).to.be.rejectedWith('save error');
  });

  it('runs createSync', () => {
    mareport.createSync(testData, opts);
    expect(outputFileSyncStub.calledWith('mochawesome-report/test.html')).to.equal(true);
  });

  it('runs createSync with no options', () => {
    mareport.createSync(testData);
    expect(outputFileSyncStub.calledWith('mochawesome-report/mochawesome.html')).to.equal(true);
  });

  it('runs createSync with base options', () => {
    mareport.createSync(testData, { dev: true });
    expect(outputFileSyncStub.calledWith('mochawesome-report/mochawesome.html')).to.equal(true);
  });

  it('runs create with autoOpen', () => {
    opts.autoOpen = true;
    outputFileStub.yields(null);
    mareport.createSync(testData, opts);
    expect(openerStub.called).to.equal(true);
  });

  it('runs createSync with data as string', () => {
    mareport.createSync(JSON.stringify(testData), opts);
    expect(outputFileSyncStub.calledWith('mochawesome-report/test.html')).to.equal(true);
  });

  it('copies assets', () => {
    mareport.createSync(testData, { inlineAssets: false });
    expect(copySyncStub.called).to.equal(true);
  });

  it('doesn\'t copy assets if assetsDir already exists', () => {
    existsSyncStub.returns(true);
    mareport.createSync(testData, { inlineAssets: false });
    expect(copySyncStub.called).to.equal(false);
  });

  it('inlines assets', () => {
    mareport.createSync(testData, { inlineAssets: true });
    expect(readFileSyncStub.called).to.equal(true);
  });
});
