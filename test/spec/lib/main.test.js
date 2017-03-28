/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
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
const writeFileUniqueStub = sinon.stub();
const mareport = proxyquire('../../../lib/src/main', {
  'fs-extra': {
    outputFile: outputFileStub,
    outputFileSync: outputFileSyncStub,
    copySync: copySyncStub,
    readFileSync: readFileSyncStub,
    existsSync: existsSyncStub
  },
  fsu: {
    writeFileUnique: writeFileUniqueStub
  },
  opener: openerStub,
  '../package.json': pkg
});

const baseOpts = {
  reportDir: 'test',
  reportFilename: 'test',
  reportTitle: 'mochawesome',
  reportPageTitle: 'mochawesome-report',
  inlineAssets: false,
  enableCharts: true,
  enableCode: true,
  overwrite: true,
  timestamp: false,
  dev: false
};

let opts;

beforeEach(() => {
  opts = Object.assign({}, baseOpts);
  outputFileStub.reset();
  outputFileSyncStub.reset();
  copySyncStub.reset();
  readFileSyncStub.reset();
  existsSyncStub.reset();
  openerStub.reset();
  writeFileUniqueStub.reset();
});

describe('lib/main', () => {
  describe('create', () => {
    it('saves report', () => {
      outputFileStub.yields(null);
      const expectedHtmlFile = path.resolve(process.cwd(), 'test', 'test.html');
      const promise = mareport.create(testData, opts);
      return expect(promise).to.become([ expectedHtmlFile ]);
    });

    it('saves report and json', () => {
      opts.saveJson = true;
      outputFileStub.yields(null);
      const expectedHtmlFile = path.resolve(process.cwd(), 'test', 'test.html');
      const expectedJsonFile = path.resolve(process.cwd(), 'test', 'test.json');
      const promise = mareport.create(testData, opts);
      return expect(promise).to.become([ expectedHtmlFile, expectedJsonFile ]);
    });

    it('with autoOpen', () => {
      opts.autoOpen = true;
      openerStub.yields(null);
      outputFileStub.yields(null);
      return mareport.create(testData, opts).then(() => {
        expect(openerStub.called).to.equal(true);
      });
    });

    it('with inline assets', () => {
      opts.inlineAssets = true;
      outputFileStub.yields(null);
      return mareport.create(testData, opts).then(() => {
        expect(copySyncStub.called).to.equal(false);
      });
    });

    it('with timestamp', () => {
      const clock = sinon.useFakeTimers(123456);
      opts.timestamp = true;
      writeFileUniqueStub.yields(null);
      const expectedFilename = path.resolve(process.cwd(), 'test', 'test_123456{_###}.html');
      return mareport.create(testData, opts).then(() => {
        expect(writeFileUniqueStub.calledWith(expectedFilename)).to.equal(true);
        clock.restore();
      });
    });

    it('with overwrite:false', () => {
      opts.overwrite = false;
      writeFileUniqueStub.yields(null);
      const expectedFilename = path.resolve(process.cwd(), 'test', 'test{_###}.html');
      return mareport.create(testData, opts).then(() => {
        expect(writeFileUniqueStub.calledWith(expectedFilename)).to.equal(true);
      });
    });

    it('rejects when outputFile throws', () => {
      outputFileStub.yields('save error');
      return expect(mareport.create(testData, opts)).to.be.rejectedWith('save error');
    });

    it('rejects when opener throws', () => {
      opts.autoOpen = true;
      openerStub.yields('open error');
      outputFileStub.yields(null);
      return expect(mareport.create(testData, opts)).to.be.rejectedWith('open error');
    });

    it('rejects when writeFileUnique throws', () => {
      opts.overwrite = false;
      writeFileUniqueStub.yields('save error');
      return expect(mareport.create(testData, opts)).to.be.rejectedWith('save error');
    });
  });

  describe('createSync', () => {
    let expectedFilename;
    let expectedFilenameWithOpts;
    beforeEach(() => {
      expectedFilename = path.resolve(process.cwd(), 'mochawesome-report', 'mochawesome.html');
      expectedFilenameWithOpts = path.resolve(process.cwd(), 'test', 'test.html');
    });

    it('with base options', () => {
      mareport.createSync(testData, { dev: true });
      expect(outputFileSyncStub.calledWith(expectedFilename)).to.equal(true);
    });

    it('with options', () => {
      mareport.createSync(testData, opts);
      expect(outputFileSyncStub.calledWith(expectedFilenameWithOpts)).to.equal(true);
    });

    it('without options', () => {
      mareport.createSync(testData);
      expect(outputFileSyncStub.calledWith(expectedFilename)).to.equal(true);
    });

    it('with autoOpen', () => {
      opts.autoOpen = true;
      mareport.createSync(testData, opts);
      expect(openerStub.called).to.equal(true);
    });

    it('with data as string', () => {
      mareport.createSync(JSON.stringify(testData), opts);
      expect(outputFileSyncStub.calledWith(expectedFilenameWithOpts)).to.equal(true);
    });
  });

  describe('copyAssets', () => {
    beforeEach(() => {
      existsSyncStub.returns(true);
      outputFileStub.yields(null);
    });

    describe('when assetsDir does not exist', () => {
      it('copies assets', () => {
        existsSyncStub.returns(false);
        return mareport.create(testData, { inlineAssets: false }).then(() => {
          expect(copySyncStub.called).to.equal(true);
        });
      });
    });

    describe('when loading css fails', () => {
      it('copies assets', () => {
        readFileSyncStub.throws();
        return mareport.create(testData, { inlineAssets: false }).then(() => {
          expect(copySyncStub.called).to.equal(true);
        });
      });
    });

    describe('when css version is not found', () => {
      it('copies assets', () => {
        readFileSyncStub.returns('abcdefg');
        return mareport.create(testData, { inlineAssets: false }).then(() => {
          expect(copySyncStub.called).to.equal(true);
        });
      });
    });

    describe('when css version is mismatch', () => {
      it('copies assets', () => {
        readFileSyncStub.returns('0.0.0');
        return mareport.create(testData, { inlineAssets: false }).then(() => {
          expect(copySyncStub.called).to.equal(true);
        });
      });
    });

    describe('when css version matches', () => {
      it('does not copy assets', () => {
        readFileSyncStub.returns(pkg.version);
        return mareport.create(testData, { inlineAssets: false }).then(() => {
          expect(copySyncStub.called).to.equal(false);
        });
      });
    });
  });
});
