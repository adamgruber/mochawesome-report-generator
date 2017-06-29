mochawesome-report-generator (marge)
============================
[![npm](https://img.shields.io/npm/v/mochawesome-report-generator.svg?style=flat-square)](http://www.npmjs.com/package/mochawesome-report-generator) [![Build Status](https://img.shields.io/travis/adamgruber/mochawesome-report-generator/master.svg?style=flat-square)](https://travis-ci.org/adamgruber/mochawesome-report-generator) [![Code Climate](https://img.shields.io/codeclimate/github/adamgruber/mochawesome-report-generator.svg?style=flat-square)](https://codeclimate.com/github/adamgruber/mochawesome-report-generator)

**marge** (**m**och**a**wesome-**r**eport-**ge**nerator) is the counterpart to [mochawesome][2], a custom reporter for use with the Javascript testing framework, [mocha][1]. Marge takes the JSON output from [mochawesome][2] and generates a full fledged HTML/CSS report that helps visualize your test suites.

## :tada: Latest Changes
- Support for mocha's `--inline-diffs` option
- Show before and after hooks alongside your tests
- New menu option for fine-tuning how hooks display

See the [CHANGELOG][] for up-to-date changes.

## Features
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

## Browser Support
Tested to work in Chrome. *Should* work in any modern web browser including IE9+.
**marge** generates a self-contained report that can be viewed offline. 

## Sample Report

<img src="./docs/marge-report-1.0.1.png" alt="Mochawesome Report" width="75%" />
<img src="./docs/marge-report-menu-1.0.1.png" alt="Mochawesome Report Menu" width="75%" />


## Usage

**via CLI**

Install mochawesome-report-generator package
```bash
npm install -g mochawesome-report-generator
```

Run the command
```bash
marge [options] data_file [data_file2 ...]
```

**via Mochawesome reporter**

See mochawesome [docs][2].

## Output
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

## CLI Options

**marge** can be configured via command line flags

Flag | Type | Default | Description 
:--- | :--- | :------ | :----------
-f, --reportFilename | string | | Filename of saved report
-o, --reportDir | string | [cwd]/mochawesome-report | Path to save report
-t, --reportTitle | string | mochawesome | Report title
-p, --reportPageTitle | string | mochawesome-report | Browser title
-i, --inline | boolean | false | Inline report assets (scripts, styles)
--charts | boolean | true | Display Suite charts
--code | boolean | true | Display test code
--autoOpen | boolean | false | Automatically open the report
--overwrite | boolean | true | Overwrite existing report files. *See [notes](#overwrite).*
--timestamp, --ts | string | | Append timestamp in specified format to report filename. *See [notes](#timestamp).*
--showHooks | string | failed | Set the default display mode for hooks
--dev | boolean | false | Enable dev mode (requires local webpack dev server)
-h, --help | | | Show CLI help


*Boolean options can be negated by adding `--no` before the option. For example: `--no-code` would set `code` to `false`.*

#### Overwrite
By default, report files are overwritten by subsequent report generation. Passing `--overwrite=false` will not replace existing files. Instead, if a duplicate filename is found, the report will be saved with a counter digit added to the filename. (ie. `mochawesome_001.html`).

**Note:** `overwrite` will always be `false` when passing multiple files or using the `timestamp` option.

#### Timestamp
The `timestamp` option can be used to append a timestamp to the report filename. It uses [dateformat][] to parse format strings so you can pass any valid string that [dateformat][] accepts with a few exceptions. In order to produce valid filenames, the following replacements are made:

Characters | Replacement | Example | Output
:--- | :--- | :--- | :---
spaces, commas | underscore | Wed March 29, 2017 | Wed_March_29_2017
slashes | hyphen | 3/29/2017 | 3-29-2017
colons | null | 17:46:21 | 174621

Further, if you pass the flag with no format string, it will default to `isoDateTime`.

[1]: https://mochajs.org/
[2]: https://github.com/adamgruber/mochawesome
[dateformat]: https://github.com/felixge/node-dateformat
[CHANGELOG]: CHANGELOG.md