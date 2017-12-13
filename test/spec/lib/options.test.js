/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { expect } from 'chai';
import { getMergedOptions } from '../../../lib/src/options';

const expectedOptions = {
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
  saveJson: false,
  saveHtml: true,
  ts: false,
  dev: false,
  showPassed: true,
  showFailed: true,
  showPending: true,
  showSkipped: false,
  showHooks: 'failed'
};

describe('options', () => {
  it('should get base options when no user options exist', () => {
    expect(getMergedOptions())
      .to.eql(expectedOptions);
  });

  describe('with user-supplied options', () => {
    let userOptions;

    beforeEach(() => {
      userOptions = {
        reportDir: 'userDir',
        inline: true,
        enableCode: false,
        dev: 'true',
        showPassed: false,
        showFailed: 'false',
        showSkipped: true
      };
      process.env.MOCHAWESOME_REPORTTITLE = 'userTitle';
      process.env.MOCHAWESOME_AUTOOPEN = 'false';
    });

    afterEach(() => {
      delete process.env.MOCHAWESOME_REPORTTITLE;
      delete process.env.MOCHAWESOME_AUTOOPEN;
    });

    it('should get merged options', () => {
      expect(getMergedOptions(userOptions))
        .to.eql(Object.assign({}, expectedOptions, userOptions, {
          inlineAssets: true,
          code: false,
          dev: true,
          showFailed: false,
          reportTitle: 'userTitle'
        }));
    });
  });
});
