const { makeTest, makeSuite, makeReport } = require('./index');

const report = makeReport(makeSuite({
  isRoot: true,
  suites: [
    makeSuite({
      suites: [
        makeSuite({
          suites: [
            makeSuite({
              tests: [
                makeTest('passed', { context: true }),
                makeTest('failed'),
              ]
            })
          ]
        }),
        makeSuite({
          suites: [
            makeSuite({
              tests: [
                makeTest('failed', { context: true }),
                makeTest('failed'),            
              ]
            })
          ],
          tests: [
            makeTest('passed', { context: true }),
            makeTest('pending'),            
          ]
        }),
        makeSuite({
          hooks: [
            makeTest('failed', { hook: 'before' })
          ],
          tests: [
            makeTest('passed'),
            makeTest('passed'),
          ]
        }),
      ],
      tests: [
        makeTest('passed', { context: true })
      ]
    })
  ]
}));

module.exports = report;
