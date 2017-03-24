/* eslint-disable import/no-extraneous-dependencies */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import testData from 'sample-data/test-data.json';
import pkg from '../../../package.json';

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
  opener: openerStub,
  '../package.json': pkg
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

beforeEach(() => {
  outputFileStub.reset();
  outputFileStub.resetBehavior();
  outputFileSyncStub.reset();
  copySyncStub.reset();
  readFileSyncStub.reset();
  existsSyncStub.reset();
  openerStub.reset();
  openerStub.resetBehavior();
});

describe('lib/main', () => {
  it('runs create', () => {
    outputFileStub.yields(null);
    return expect(mareport.create(testData, opts)).to.be.fulfilled;
  });

  it('runs create with autoOpen', () => {
    opts.autoOpen = true;
    openerStub.yields(null);
    outputFileStub.yields(null);
    return mareport.create(testData, opts).then(() => {
      expect(openerStub.called).to.equal(true);
    });
  });

  it('runs create and throws', () => {
    outputFileStub.yields('save error');
    return expect(mareport.create(testData, opts)).to.be.rejectedWith('save error');
  });

  it('runs create with autoOpen and throws', () => {
    opts.autoOpen = true;
    openerStub.yields('open error');
    outputFileStub.yields(null);
    return expect(mareport.create(testData, opts)).to.be.rejectedWith('open error');
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

  it('runs createSync with autoOpen', () => {
    opts.autoOpen = true;
    mareport.createSync(testData, opts);
    expect(openerStub.called).to.equal(true);
  });

  it('runs createSync with data as string', () => {
    mareport.createSync(JSON.stringify(testData), opts);
    expect(outputFileSyncStub.calledWith('mochawesome-report/test.html')).to.equal(true);
  });

  describe('copyAssets', () => {
    beforeEach(() => {
      existsSyncStub.returns(true);
    });

    describe('when assetsDir does not exist', () => {
      it('copies assets', () => {
        existsSyncStub.returns(false);
        mareport.createSync(testData, { inlineAssets: false });
        expect(copySyncStub.called).to.equal(true);
      });
    });

    describe('when loading css fails', () => {
      it('copies assets', () => {
        readFileSyncStub.throws();
        mareport.createSync(testData, { inlineAssets: false });
        expect(copySyncStub.called).to.equal(true);
      });
    });

    describe('when css version is not found', () => {
      it('copies assets', () => {
        readFileSyncStub.returns('abcdefg');
        mareport.createSync(testData, { inlineAssets: false });
        expect(copySyncStub.called).to.equal(true);
      });
    });

    describe('when css version is mismatch', () => {
      it('copies assets', () => {
        readFileSyncStub.returns('0.0.0');
        mareport.createSync(testData, { inlineAssets: false });
        expect(copySyncStub.called).to.equal(true);
      });
    });

    describe('when css version matches', () => {
      it('does not copy assets', () => {
        readFileSyncStub.returns(pkg.version);
        mareport.createSync(testData, { inlineAssets: false });
        expect(copySyncStub.called).to.equal(false);
      });
    });
  });

  it('inlines assets', () => {
    mareport.createSync(testData, { inlineAssets: true });
    expect(readFileSyncStub.called).to.equal(true);
  });
});
