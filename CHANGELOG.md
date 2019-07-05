# mochawesome-report-generator changelog

## [Unreleased]

## [4.0.1] / 2019-07-05
### Changed
- Video links in context now support mediafragment uris [mochawesome #287](https://github.com/adamgruber/mochawesome/issues/287)

## [4.0.0] / 2019-06-04
### Changed
- Updated data validation to match mochawesome v4 changes
- Updated many components for accessibility
- Enhanced keyboard usage (tabbing / toggling)
- Updated all dependencies
- Implemented test fixtures for generating sample data
- Small design tweaks
- Allow suites to be collapsed
- Disable charts by default

## [3.1.5] / 2018-12-27
### Changed
- Relaxed validation for `timedOut` property in Tests to provide better compatibility with Cypress [#88](https://github.com/adamgruber/mochawesome-report-generator/issues/88)

## [3.1.4] / 2018-10-05
### Changed
- Added `pending` and `skipped` to `TestState` enum. [#111](https://github.com/adamgruber/mochawesome-report-generator/issues/111)

## [3.1.3] / 2018-07-18
### Fixed
- Updated webpack config to correctly set `devtool` to `false` when building for production. [#101](https://github.com/adamgruber/mochawesome-report-generator/issues/101)

## [3.1.2] / 2018-04-20
### Fixed
- Skip copying assets and rendering HTML when `html` option is `false` [mochawesome #237](https://github.com/adamgruber/mochawesome/issues/237)

## [3.1.1] / 2018-01-28
### Added
- Video links in context will render as `<video>` tags [#87](https://github.com/adamgruber/mochawesome-report-generator/pull/87) (@NicholasBoll)

## [3.1.0] / 2018-01-08
### Added
- New option: **`cdn`**. Set to `true` to load all report assets via CDN (unpkg.com). No assets will be copied to disk.
- New option: **`assetsDir`**. Use this to specify a custom location to save the report assets to.
- The CLI has been updated to support directories as agruments.
- New options: **`showPassed`, `showFailed`, `showPending`, `showSkipped`**. Use these to set the default state of the report filters.

### Changed
- Excluded Mobx DevTools from production bundle
- Dropped ChartJS in favor of Chartist
- Dropped moment.js in favor of date-fns
- Use a top-level `<Provider>` component to make the report store available to all components

## [3.0.1] / 2017-12-01
No release is complete without a quick hotfix.

### Fixed
- The `transform-react-constant-elements` babel plugin was causing one of the React components to be hoisted as a `const` when it should not have been. This caused React to throw an error and the whole report to fail to load. (https://github.com/adamgruber/mochawesome/issues/215)

## [3.0.0] / 2017-11-30
### Added
- The report now displays a loading animation when loading and when toggling filters.
- The report version is now shown in the footer.
- Functional tests to make development a little easier

### Changed
- **BREAKING:** mochawesome v3.0.0 introduces changes to its JSON output that are not backwards-compatible. As such, the report generator will not work with data created in older versions of mochawesome.

- Options handling and file saving that was previously done in the reporter is now handled here where it makes more sense. In addition, support was added for the `saveJson` and `saveHtml` options.

- Improved perceived rendering. The report no longer shows just a blank screen when loading a large number of tests. Instead, the navbar stats and footer will be rendered along with a nice loading animation. In addition, the filter toggles are now more responsive when filtering over a large number of suites/tests.

- Nearly all components have been updated to use flexbox layout.

- Unnecessary component renders have been significantly reduced.

- Most dependencies have been updated to their latest versions.


### [2.3.2] / 2017-11-13
- Fix an issue where long test titles are truncated with no way to see the full title [#65](https://github.com/adamgruber/mochawesome-report-generator/issues/65)

### [2.3.1] / 2017-10-23
- Fix botched release

## [2.3.0] / 2017-10-23
- Add support for base64 images in test context [#60](https://github.com/adamgruber/mochawesome-report-generator/pull/60 - @gidztech

### [2.2.2] / 2017-07-07
- Fix an issue where `actual/expected` was being rendered in the CodeSnippet for non-diff code
- Fix an issue where the suite header was not being rendered for root suites with tests

### [2.2.1] / 2017-06-30
- Enable inline diff rendering when using CLI. [#42](https://github.com/adamgruber/mochawesome-report-generator/pull/42)

## [2.2.0] / 2017-06-29

#### Updated / New
- Render inline diffs when using mocha's `--inline-diffs` option [#39](https://github.com/adamgruber/mochawesome-report-generator/pull/39)
- Set the default option for how hooks should display via the `showHooks` option [#41](https://github.com/adamgruber/mochawesome-report-generator/pull/41)
- Add a new `context` display option for hooks which will only show hooks if they contain context [#41](https://github.com/adamgruber/mochawesome-report-generator/pull/41)

#### Bug Fixes
- Don't apply syntax highlighting when `context` is an object and `context.value` is a string [#40](https://github.com/adamgruber/mochawesome-report-generator/pull/40)
- Various display issues [#36](https://github.com/adamgruber/mochawesome-report-generator/pull/36) [#38](https://github.com/adamgruber/mochawesome-report-generator/pull/38)

### [2.1.1] / 2017-06-26
- Remove `dangerouslySetInnerHTML` from CodeSnippet component. [#34](https://github.com/adamgruber/mochawesome-report-generator/issues/34)

## [2.1.0] / 2017-06-08
- Add support for displaying before and after hooks

### [2.0.3] / 2017-05-09
- Add support for rendering context with `undefined` or `null` value 

### [2.0.2] / 2017-04-25
- Update package.json to spec `fsu` to `^1.0.2` which fixes compatibility with node 4

## [2.0.0] / 2017-04-19
- Add support for multiple files via CLI
- New options: `overwrite` and `timestamp`

#### Breaking
- Change default `reportFilename` from `mochawesome` to same as input filename

Prior to 2.0.0, the default report name was `mochawesome`. Now the default report name will be the same as the input filename. Example:
```sh
$ marge test/sample-data.json

# before 2.0.0 => mochawesome-report/mochawesome.html
# after 2.0.0 => mochawesome-report/sample-data.html
```
You can still use the `--reportFilename` flag to set the filename of the generated report.

### [1.1.2] / 2017-03-13
- Fix an issue where autoOpen did not work on Windows [mochawesome #142](https://github.com/adamgruber/mochawesome/issues/144)
- Add `autoOpen` option to CLI

### [1.1.1] / 2017-02-20
- Fix an inconsistency between the diff output in the console and the diff output in the report [mochawesome #142](https://github.com/adamgruber/mochawesome/issues/142)
- Fix an issue where the report assets would not get updated after upgrading package version. [mochawesome #138](https://github.com/adamgruber/mochawesome/issues/138)
- Fix an issue where trying to copy text from code or context blocks would collapse the test. [mochawesome #138](https://github.com/adamgruber/mochawesome/issues/138)
- Validate JSON input against schema before creating a report (CLI only)

## [1.1.0]
- Greenkeeping
- Move some dependencies into devDependencies where they belong [mochawesome #133](https://github.com/adamgruber/mochawesome/issues/133)

### [1.0.8] / 2017-02-16
- Only copy external assets if they do not already exist [mochawesome #76](https://github.com/adamgruber/mochawesome/issues/76)

### [1.0.7] / 2017-02-15
- Fix an issue where test context could not be viewed if `enableCode` option was `false`. [mochawesome #132](https://github.com/adamgruber/mochawesome/issues/132)
- Add an icon to indicate when a test has context

### [1.0.6] / 2017-01-31
- Layout and style fixes [mochawesome #118](https://github.com/adamgruber/mochawesome/issues/118)

### [1.0.5] / 2017-01-30
- Layout and style fixes [mochawesome #118](https://github.com/adamgruber/mochawesome/issues/118) (Broken)

### [1.0.4] / 2017-01-23
- Add support for local image paths in context

### [1.0.3] / 2017-01-13
- Fix an issue preventing a working report when `inlineAssets` option is `true` [mochawesome #109](https://github.com/adamgruber/mochawesome/issues/109)
- Restore `autoOpen` functionality

### [1.0.2] / 2016-12-27
- Transpile `bin` and `lib` for compatibility with node 4

### [1.0.1] / 2016-12-26
- Better url handling in context

## 1.0.0 / 2016-12-18
- Initial release

[Unreleased]: https://github.com/adamgruber/mochawesome-report-generator/compare/4.0.1...HEAD
[4.0.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/4.0.0...4.0.1
[4.0.0]: https://github.com/adamgruber/mochawesome-report-generator/compare/3.1.5...4.0.0
[3.1.5]: https://github.com/adamgruber/mochawesome-report-generator/compare/3.1.4...3.1.5
[3.1.4]: https://github.com/adamgruber/mochawesome-report-generator/compare/3.1.3...3.1.4
[3.1.3]: https://github.com/adamgruber/mochawesome-report-generator/compare/3.1.2...3.1.3
[3.1.2]: https://github.com/adamgruber/mochawesome-report-generator/compare/3.1.1...3.1.2
[3.1.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/3.1.0...3.1.1
[3.1.0]: https://github.com/adamgruber/mochawesome-report-generator/compare/3.0.1...3.1.0
[3.0.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.3.2...3.0.0
[2.3.2]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.3.1...2.3.2
[2.3.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.3.0...2.3.1
[2.3.0]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.2.2...2.3.0
[2.2.2]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.2.1...2.2.2
[2.2.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.2.0...2.2.1
[2.2.0]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.1.1...2.2.0
[2.1.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.0.3...2.1.0
[2.0.3]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.1.2...2.0.0
[1.1.2]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.8...1.1.0
[1.0.8]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.7...1.0.8
[1.0.7]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.6...1.0.7
[1.0.6]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.5...1.0.6
[1.0.5]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.5...1.0.5
[1.0.4]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/adamgruber/mochawesome-report-generator/compare/1.0.0...1.0.1
