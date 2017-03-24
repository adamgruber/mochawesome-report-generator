#Changelog

###1.1.2
- Fix an issue where autoOpen did not work on Windows [mochawesome #142](https://github.com/adamgruber/mochawesome/issues/144)
- Add `autoOpen` option to CLI

###1.1.1
- Fix an inconsistency between the diff output in the console and the diff output in the report [mochawesome #142](https://github.com/adamgruber/mochawesome/issues/142)
- Fix an issue where the report assets would not get updated after upgrading package version. [mochawesome #138](https://github.com/adamgruber/mochawesome/issues/138)
- Fix an issue where trying to copy text from code or context blocks would collapse the test. [mochawesome #138](https://github.com/adamgruber/mochawesome/issues/138)
- Validate JSON input against schema before creating a report (CLI only)

###1.1.0
- Greenkeeping
- Move some dependencies into devDependencies where they belong [mochawesome #133](https://github.com/adamgruber/mochawesome/issues/133)

###1.0.8
- Only copy external assets if they do not already exist [mochawesome #76](https://github.com/adamgruber/mochawesome/issues/76)

###1.0.7
- Fix an issue where test context could not be viewed if `enableCode` option was `false`. [mochawesome #132](https://github.com/adamgruber/mochawesome/issues/132)
- Add an icon to indicate when a test has context

###1.0.6
- Layout and style fixes [mochawesome #118](https://github.com/adamgruber/mochawesome/issues/118)

###1.0.5
- Layout and style fixes [mochawesome #118](https://github.com/adamgruber/mochawesome/issues/118) (Broken)

###1.0.4
- Add support for local image paths in context

###1.0.3
- Fix an issue preventing a working report when `inlineAssets` option is `true` [mochawesome #109](https://github.com/adamgruber/mochawesome/issues/109)
- Restore `autoOpen` functionality

###1.0.2
- Transpile `bin` and `lib` for compatibility with node 4

###1.0.1
- Better url handling in context

###1.0.0
- Initial release
