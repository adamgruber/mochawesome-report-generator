mochawesome-report-generator (marge)
============================
[![npm](https://img.shields.io/npm/v/mochawesome-report-generator.svg?style=flat-square)](http://www.npmjs.com/package/mochawesome-report-generator) [![Build Status](https://img.shields.io/travis/adamgruber/mochawesome-report-generator/master.svg?style=flat-square)](https://travis-ci.org/adamgruber/mochawesome-report-generator) [![Code Climate](https://img.shields.io/codeclimate/github/adamgruber/mochawesome-report-generator.svg?style=flat-square)](https://codeclimate.com/github/adamgruber/mochawesome-report-generator)

**marge** (**m**och**a**wesome-**r**eport-**ge**nerator) is the counterpart to [mochawesome][2], a custom reporter for use with the Javascript testing framework, [mocha][1]. Marge takes the JSON output from [mochawesome][2] and generates a full fledged HTML/CSS report that helps visualize your test suites.

##Features
- All-new redesigned and streamlined report
- At-a-glance stats including pass percentage
- Beautiful charts
- Support for nested `describe`s
- Supports pending tests
- Filter view by test type
- Quick navigation menu
- Review test code inline
- Stack trace for failed tests
- Inline diffs for actual vs expected results
- Responsive and mobile-friendly
- Supports displaying additional test context
- Custom report [options](#cli-options)
- Offline viewing
- CLI for generating reports independent of [mochawesome][2]

##Browser Support
Tested to work in Chrome. *Should* work in any modern web browser including IE9+.
**marge** generates a self-contained report that can be viewed offline. 

##Sample Report

<img src="./docs/marge-report-1.0.1.png" alt="Mochawesome Report" width="75%" />
<img src="./docs/marge-report-menu-1.0.1.png" alt="Mochawesome Report Menu" width="75%" />


##Usage

**via CLI**

Install mochawesome-report-generator package
```bash
npm install -g mochawesome-report-generator
```

Run the command
```bash
marge [test-output.json] <options>
```

**via Mochawesome reporter**

See mochawesome [docs][2].

##Output
**marge** generates the following inside your project directory:
```
mochawesome-report/
├── assets
│   ├── app.css
│   ├── app.js
│   ├── MaterialIcons-Regular.woff
│   ├── MaterialIcons-Regular.woff2
│   ├── roboto-light-webfont.woff
│   ├── roboto-light-webfont.woff2
│   ├── roboto-medium-webfont.woff
│   ├── roboto-medium-webfont.woff2
│   ├── roboto-regular-webfont.woff
│   └── roboto-regular-webfont.woff2
└── mochawesome.html
```

##CLI Options

**marge** can be configured via command line flags

Flag | Type | Default | Description 
:--- | :--- | :------ | :----------
-f, --reportFilename | string | mochawesome | Filename of saved report
-o, --reportDir | string | [cwd]/mochawesome-report | Path to save report
-t, --reportTitle | string | mochawesome | Report title
-p, --reportPageTitle | string | mochawesome-report | Browser title
-i, --inline | boolean | false | Inline report assets (scripts, styles)
--charts | boolean | true | Display Suite charts
--code | boolean | true | Display test code
--dev | boolean | false | Enable dev mode (requires local webpack dev server)
-h, --help | | | Show CLI help


*Boolean options can be negated by adding `--no` before the option. For example: `--no-code` would set `code` to `false`.*

[1]: http://visionmedia.github.io/mocha/
[2]: https://github.com/adamgruber/mochawesome