require('babel-core/register');
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
const React = require('react');
const render = require('react-dom/server').renderToStaticMarkup;
const MainHTML = require('../src/components/main');

// Load Test Data
const testData = require('../test-data.json');
const testData2 = require('../test-data-2.json');

// Fn to load inline styles
const getInlineStyles = (cb) => {
  // css to be processed
  const fromPath = path.join(__dirname, '../src/styles/app.global.css');
  const css = fs.readFileSync(fromPath, 'utf8');

  postcss()
    .use(atImport())
    .process(css, {
      from: fromPath
    })
    .then(result => {
      cb(result.css);
    });
};

function createReport(data, opts) {
  console.log(data, opts);
  const options = Object.assign(opts, {
    reportTitle: 'adam',
    inlineAssets: false
  });

  // Render basic template to string
  const html = render(
    React.createElement(MainHTML, {
      data: testData2,
      options,
      styles: fs.readFileSync(path.join(__dirname, '..', 'dist', 'app.css'), 'utf8'),
      scripts: fs.readFileSync(path.join(__dirname, '..', 'dist', 'app.js'), 'utf8')
    })
  );

  // Save HTML to file
  try {
    const outFile = path.join(__dirname, '../dist/report.html');
    console.log(outFile);
    const writeFile = fs.openSync(outFile, 'w');
    fs.writeSync(writeFile, `<!doctype html>\n${html}`);
    fs.close(writeFile);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { createReport };
