const path = require('path');
const report = require('../lib/main');
const data = require('./test-data.json');
// const data = require('./test-data-single.json');

report.createSync(data, {
  dev: true,
  reportHtmlFile: path.join(__dirname, 'reportTest.html')
});
