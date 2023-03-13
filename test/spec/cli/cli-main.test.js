/* eslint-disable import/no-extraneous-dependencies */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs-extra';
import dateFormat from 'dateformat';

import invalidTestData from 'sample-data/invalid.json';

chai.use(chaiAsPromised);
proxyquire.noCallThru();

const createStub = sinon.stub();
const logger = {
  info: sinon.spy(),
  error: sinon.spy(),
};
const cli = proxyquire('../../../src/bin/cli-main', {
  '../lib/main': {
    create: createStub,
  },
  './logger': logger,
});

const error = { code: 12345, message: 'Err' };
const getArgs = (files, args) => Object.assign({}, { _: files }, args);

const cleanDateStr = fmt =>
  dateFormat(new Date(), fmt)
    .replace(/(,\s*)|,|\s+/g, '_')
    .replace(/\\|\//g, '-')
    .replace(/:/g, '');

afterEach(() => {
  createStub.reset();
  logger.info.resetHistory();
  logger.error.resetHistory();
});

describe('bin/cli', () => {
  describe('when data is valid', () => {
    beforeEach(() => {
      createStub.onCall(0).resolves('mochawesome-report/test.html');
      createStub.onCall(1).resolves('mochawesome-report/single.html');
    });

    it('should create reports', () => {
      const args = getArgs([
        'test/sample-data/test.json',
        'test/sample-data/single.json',
      ]);
      return expect(cli(args)).to.become([
        'mochawesome-report/test.html',
        'mochawesome-report/single.html',
      ]);
    });
  });

  describe('when file is not found', () => {
    it('should not create a report', () => {
      const args = getArgs(['test/sample-data/not-found.json']);
      return expect(cli(args)).to.become([
        {
          filename: 'test/sample-data/not-found.json',
          data: undefined,
          err: '  File not found.',
        },
      ]);
    });
  });

  describe('when arg is a directory', () => {
    beforeEach(() => {
      createStub.onCall(0).resolves('mochawesome-report/single.html');
    });

    it('should create a report', () => {
      const args = getArgs(['test/sample-data/sub']);
      return expect(cli(args)).to.become(['mochawesome-report/single.html']);
    });
  });

  describe('when file is not JSON', () => {
    it('should not create a report', () => {
      const args = getArgs(['README.md']);
      return expect(cli(args)).to.become([]);
    });
  });

  describe('when JSON cannot be parsed', () => {
    beforeEach(() => {
      sinon
        .stub(JSON, 'parse')
        .throws({ message: 'Unexpected token b in JSON at position 4' });
    });

    afterEach(() => {
      JSON.parse.restore();
    });

    it('should not create a report', () => {
      const args = getArgs(['test/sample-data/bad.json']);
      return expect(cli(args)).to.become([
        {
          filename: 'test/sample-data/bad.json',
          data: undefined,
          err: '  Unexpected token b in JSON at position 4',
        },
      ]);
    });
  });

  describe('when JSON fails validation', () => {
    it('should not create a report', () => {
      const args = getArgs(['test/sample-data/invalid.json']);
      return expect(cli(args)).to.become([
        {
          filename: 'test/sample-data/invalid.json',
          data: invalidTestData,
          // eslint-disable-next-line max-len
          err:
            '  Invalid value null supplied to /stats/suites: Number\n  Invalid value undefined supplied to /results/0/title: String',
        },
      ]);
    });
  });

  describe('when a generic error occurs', () => {
    beforeEach(() => {
      sinon.stub(fs, 'readFileSync').throws(error);
    });

    afterEach(() => {
      fs.readFileSync.restore();
    });

    it('should not create a report', () => {
      const args = getArgs(['test/sample-data/generic.json']);
      return expect(cli(args)).to.become([
        {
          filename: 'test/sample-data/generic.json',
          data: undefined,
          err: '  There was a problem loading mochawesome data.',
        },
      ]);
    });
  });

  describe('when create fails', () => {
    beforeEach(() => {
      createStub.rejects(error);
    });
    it('should reject when create fails', () => {
      const args = getArgs(['test/sample-data/test.json']);
      return expect(cli(args)).to.be.rejectedWith(error);
    });
  });

  describe('options', () => {
    describe('overwrite', () => {
      beforeEach(() => {
        createStub.resolves('mochawesome-report/test.html');
      });

      it('should be false when timestamp option is passed', () => {
        const args = getArgs(['test/sample-data/test.json'], { timestamp: '' });

        return cli(args).then(() => {
          expect(createStub.args[0][1]).to.have.property('overwrite', false);
        });
      });

      it('should be false when multiple valid files exist', () => {
        const args = getArgs([
          'test/sample-data/test.json',
          'test/sample-data/single.json',
        ]);

        return cli(args).then(() => {
          expect(createStub.args[0][1]).to.have.property('overwrite', false);
        });
      });
    });

    describe('reportFilename', () => {
      beforeEach(() => {
        createStub.resolves('mochawesome-report/test.html');
      });

      it('should default to filename when option not provided', () => {
        const args = getArgs(['test/sample-data/test.json']);

        return cli(args).then(() => {
          expect(createStub.args[0][1]).to.have.property(
            'reportFilename',
            'test/sample-data/test'
          );
        });
      });

      it('should be option when provided', () => {
        const args = getArgs(['test/sample-data/test.json'], {
          reportFilename: 'sample',
        });

        return cli(args).then(() => {
          expect(createStub.args[0][1]).to.have.property(
            'reportFilename',
            'sample'
          );
        });
      });

      it('should handle html extension', () => {
        const args = getArgs(['test/sample-data/test.json'], {
          reportFilename: 'test.html',
        });

        return cli(args).then(() => {
          expect(createStub.args[0][1]).to.have.property(
            'reportFilename',
            'test'
          );
        });
      });

      it('should handle json extension', () => {
        const args = getArgs(['test/sample-data/test.json'], {
          reportFilename: 'test.json',
        });

        return cli(args).then(() => {
          expect(createStub.args[0][1]).to.have.property(
            'reportFilename',
            'test'
          );
        });
      });

      it('should handle replacement tokens', () => {
        const args = getArgs(['test/sample-data/test.json'], {
          reportFilename: '[status]-[name]-[datetime]',
        });

        return cli(args).then(() => {
          expect(createStub.args[0][1]).to.have.property(
            'reportFilename',
            `fail-test/sample-data/test-${cleanDateStr('isoDateTime')}`
          );
        });
      });

      it('should handle replacement tokens and timestamp', () => {
        const args = getArgs(['test/sample-data/test.json'], {
          timestamp: 'fullDate',
          reportFilename: '[status]-[name]-[datetime]',
        });

        return cli(args).then(() => {
          expect(createStub.args[0][1]).to.have.property(
            'reportFilename',
            `fail-test/sample-data/test-${cleanDateStr('fullDate')}`
          );
        });
      });
    });
  });
});
