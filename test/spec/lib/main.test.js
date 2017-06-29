/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dateFormat from 'dateformat';

import testData from 'sample-data/test.json';
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
  dev: false,
  showHooks: 'failed'
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
      const expectedHtmlFile = path.resolve(process.cwd(), 'test', 'test.html');
      outputFileStub.resolves(expectedHtmlFile);
      const promise = mareport.create(testData, opts);
      return expect(promise).to.become([ expectedHtmlFile ]);
    });

    it('saves report and json', () => {
      opts.saveJson = true;
      const expectedHtmlFile = path.resolve(process.cwd(), 'test', 'test.html');
      const expectedJsonFile = path.resolve(process.cwd(), 'test', 'test.json');
      outputFileStub
        .onCall(0).resolves(expectedHtmlFile)
        .onCall(1).resolves(expectedJsonFile);
      const promise = mareport.create(testData, opts);
      return expect(promise).to.become([ expectedHtmlFile, expectedJsonFile ]);
    });

    it('with autoOpen', () => {
      opts.autoOpen = true;
      openerStub.yields(null);
      outputFileStub.resolves();
      return mareport.create(testData, opts).then(() => {
        expect(openerStub.called).to.equal(true);
      });
    });

    it('with inline assets', () => {
      opts.inlineAssets = true;
      outputFileStub.resolves();
      return mareport.create(testData, opts).then(() => {
        expect(copySyncStub.called).to.equal(false);
      });
    });

    describe('with timestamp', () => {
      let clock;

      const getExpectedName = dateTimeStr => (
        path.resolve(process.cwd(), 'test', `test${dateTimeStr}{_###}.html`)
      );

      const cleanDateStr = fmt => (
        dateFormat(new Date(), fmt)
          .replace(/(,\s*)|,|\s+/g, '_')
          .replace(/\\|\//g, '-')
          .replace(/:/g, '')
      );

      beforeEach(() => {
        // Set clock to 2017-03-29T19:30:59.913Z
        clock = sinon.useFakeTimers(1490815859913);
      });

      afterEach(() => {
        clock.restore();
      });

      it('with timestamp, boolean -> default format', () => {
        opts.timestamp = true;
        opts.overwrite = false;
        writeFileUniqueStub.yields(null);
        return mareport.create(testData, opts).then(() => {
          expect(writeFileUniqueStub.args[0][0])
            .to.equal(getExpectedName(`_${cleanDateStr('isoDateTime')}`));
        });
      });

      it('with timestamp, true string -> default format', () => {
        opts.timestamp = 'true';
        opts.overwrite = false;
        writeFileUniqueStub.yields(null);
        return mareport.create(testData, opts).then(() => {
          expect(writeFileUniqueStub.args[0][0])
            .to.equal(getExpectedName(`_${cleanDateStr('isoDateTime')}`));
        });
      });

      it('with timestamp, false string -> no timestamp', () => {
        opts.timestamp = 'false';
        opts.overwrite = false;
        writeFileUniqueStub.yields(null);
        return mareport.create(testData, opts).then(() => {
          expect(writeFileUniqueStub.args[0][0])
            .to.equal(getExpectedName(''));
        });
      });

      it('with timestamp, empty string -> default format', () => {
        opts.timestamp = '';
        opts.overwrite = false;
        writeFileUniqueStub.yields(null);
        return mareport.create(testData, opts).then(() => {
          expect(writeFileUniqueStub.args[0][0])
            .to.equal(getExpectedName(`_${cleanDateStr('isoDateTime')}`));
        });
      });

      it('with timestamp, fullDate format', () => {
        opts.timestamp = 'fullDate';
        opts.overwrite = false;
        writeFileUniqueStub.yields(null);
        return mareport.create(testData, opts).then(() => {
          expect(writeFileUniqueStub.args[0][0])
            .to.equal(getExpectedName(`_${cleanDateStr('fullDate')}`));
        });
      });

      it('with timestamp, longTime format', () => {
        opts.timestamp = 'longTime';
        opts.overwrite = false;
        writeFileUniqueStub.yields(null);
        return mareport.create(testData, opts).then(() => {
          expect(writeFileUniqueStub.args[0][0])
            .to.equal(getExpectedName(`_${cleanDateStr('longTime')}`));
        });
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
      outputFileStub.rejects(new Error('save error'));
      return expect(mareport.create(testData, opts)).to.be.rejectedWith('save error');
    });

    it('rejects when opener throws', () => {
      opts.autoOpen = true;
      openerStub.yields('open error');
      outputFileStub.resolves(null);
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
      outputFileStub.resolves(null);
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

    describe('when dev option is true', () => {
      it('does not copy assets', () => (
        mareport.create(testData, { dev: true }).then(() => {
          expect(copySyncStub.called).to.equal(false);
        })
      ));
    });
  });

  describe('defaults', () => {
    it('should get base options', () => {
      expect(mareport.getBaseConfig())
        .to.eql({
          reportDir: 'mochawesome-report',
          reportTitle: process.cwd().split(path.sep).pop(),
          reportPageTitle: 'Mochawesome Report',
          inline: false,
          inlineAssets: false,
          charts: true,
          enableCharts: true,
          code: true,
          enableCode: true,
          autoOpen: false,
          overwrite: true,
          timestamp: false,
          ts: false,
          dev: false,
          showHooks: 'failed'
        });
    });
  });
});
