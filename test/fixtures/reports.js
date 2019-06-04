const {
  makeTest,
  makeReport,
  PASSED,
  FAILED,
  PENDING,
  BEFORE,
  BEFORE_EACH,
  AFTER,
  AFTER_EACH,
  FAILED_BEFORE,
  FAILED_AFTER,
} = require('./index');

const nested = makeReport([
  [
    [
      [[makeTest('passed', { context: true }), FAILED]],
      [
        [makeTest('failed', { context: true }), FAILED],
        makeTest('passed', { context: true }),
        PENDING,
      ],
      [FAILED_BEFORE, PASSED, PASSED],
    ],
    makeTest('passed', { context: true }),
  ],
]);

const hooks = makeReport([
  [
    [FAILED_BEFORE, AFTER, PASSED, PASSED],
    [BEFORE_EACH, FAILED_AFTER, PENDING, FAILED],
    BEFORE,
    BEFORE_EACH,
    AFTER,
    AFTER_EACH,
    PENDING,
    PASSED,
    FAILED,
  ],
]);

module.exports = {
  nested,
  hooks,
};
