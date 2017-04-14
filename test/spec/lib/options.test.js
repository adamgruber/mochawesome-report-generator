/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { expect } from 'chai';
import options from '../../../lib/src/options';

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
  ts: false,
  dev: false
};

describe('options', () => {
  it('should get yargs options', () => {
    expect(options.getYargsOptions())
      .to.have.deep.property('o.default', expectedOptions.reportDir);
  });

  it('should get base options', () => {
    expect(options.getBaseConfig())
      .to.eql(expectedOptions);
  });
});
