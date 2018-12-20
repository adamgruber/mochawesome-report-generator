/* eslint-disable import/prefer-default-export, no-use-before-define, no-param-reassign */
const faker = require('faker');

const PASSED = 'passed';
const FAILED = 'failed';
const PENDING = 'pending';
const BEFORE = 'before';
const BEFORE_EACH = 'beforeEach';
const AFTER = 'after';
const AFTER_EACH = 'afterEach';
const FAILED_BEFORE = 'failedBefore';
const FAILED_BEFORE_EACH = 'failedBeforeEach';
const FAILED_AFTER = 'failedAfter';
const FAILED_AFTER_EACH = 'failedAfterEach';

const baseTest = {
  title: null,
  fullTitle: null,
  timedOut: null,
  duration: null,
  state: null,
  speed: null,
  pass: null,
  fail: null,
  pending: null,
  context: null,
  code: null,
  err: null,
  uuid: null,
  parentUUID: null,
  isHook: null,
  skipped: null,
};

const testStates = {
  passed: {
    timedOut: false,
    state: 'passed',
    pass: true,
    fail: false,
    pending: false,
    isHook: false,
    skipped: false,
  },
  failed: {
    timedOut: false,
    state: 'failed',
    speed: null,
    pass: false,
    fail: true,
    pending: false,
    isHook: false,
    skipped: false,
  },
  pending: {
    timedOut: false,
    duration: 0,
    state: null,
    speed: null,
    pass: false,
    fail: false,
    pending: true,
    context: null,
    code: '',
    err: {},
    isHook: false,
    skipped: false,
  },
  skipped: {
    timedOut: false,
    duration: 0,
    state: null,
    speed: null,
    pass: false,
    fail: false,
    pending: false,
    context: null,
    err: {},
    isHook: false,
    skipped: true,
  },
};

const testSpeeds = {
  fast: 10,
  medium: 300,
  slow: 2500,
};

const baseHookState = {
  timedOut: false,
  duration: 0,
  state: null,
  speed: null,
  pass: false,
  fail: false,
  pending: false,
  code: "console.log('hook');",
  err: {},
  isHook: true,
  skipped: false,
  parentUUID: null,
};

const failedHookState = {
  fail: true,
  state: 'failed',
  code: 'console.log(a);',
  err: {
    message: 'ReferenceError: a is not defined',
    estack:
      'ReferenceError: a is not defined\n    at Context.after (test-functional/passed.js:5:17)',
    diff: null,
  },
};

const hookStates = {
  before: {
    ...baseHookState,
    title: '"before all" hook',
    fullTitle: '"before all" hook',
  },
  beforeEach: {
    ...baseHookState,
    title: '"before each" hook',
    fullTitle: '"before each" hook',
  },
  after: {
    ...baseHookState,
    title: '"after all" hook',
    fullTitle: '"after all" hook',
  },
  afterEach: {
    ...baseHookState,
    title: '"after each" hook',
    fullTitle: '"after each" hook',
  },
};

function fakeTitle() {
  return faker.hacker.phrase();
}
function fakeFile() {
  const file = faker.system.commonFileName('js');
  const fullFile = `tests/${file}`;
  return { file, fullFile };
}
function fakeDuration() {
  const speeds = Object.keys(testSpeeds).map(speed => [
    speed,
    testSpeeds[speed],
  ]);
  return faker.random.arrayElement(speeds);
}
function fakeContext() {
  return faker.random.arrayElement([
    'This is text context',
    'http://i.imgur.com/YLsnPfjb.jpg',
    JSON.stringify({
      title: 'This is an object context',
      value: { context: true },
    }),
  ]);
}
function fakeVersion() {
  return faker.system.semver();
}
function timedOut() {
  return {
    speed: null,
    duration: 2005,
    timedOut: true,
    err: {
      message:
        'Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/Users/adamg/Sites/mochawesome/test-functional/passed.js)',
      estack:
        'Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/Users/adamg/Sites/mochawesome/test-functional/passed.js)',
      diff: null,
    },
  };
}

function passingTest(attrs = {}) {
  const title = fakeTitle();
  const [speed, duration] = fakeDuration();
  return {
    ...baseTest,
    title,
    fullTitle: title,
    duration,
    speed,
    context: null,
    code: '(1+1).should.equal(2);',
    err: {},
    uuid: faker.random.uuid(),
    parentUUID: faker.random.uuid(),
    ...testStates.passed,
    ...attrs,
  };
}

function failingTest(attrs = {}) {
  const title = fakeTitle();
  const [speed, duration] = fakeDuration();
  return {
    ...baseTest,
    title,
    fullTitle: title,
    duration,
    speed,
    context: null,
    code: '(1+1).should.equal(3);',
    err: {
      message: 'AssertionError: expected 2 to be 3',
      estack:
        'AssertionError: expected 2 to be 3\n    at Assertion.fail (node_modules/should/cjs/should.js:275:17)\n    at Assertion.value (node_modules/should/cjs/should.js:356:19)\n    at Context.done (test/failed.js:2:16)',
      diff: '- 2\n+ 3\n',
    },
    uuid: faker.random.uuid(),
    parentUUID: faker.random.uuid(),
    ...testStates.failed,
    ...attrs,
  };
}

function pendingTest(attrs = {}) {
  const title = fakeTitle();
  return {
    ...baseTest,
    title,
    fullTitle: title,
    uuid: faker.random.uuid(),
    parentUUID: faker.random.uuid(),
    ...testStates.pending,
    ...attrs,
  };
}

function skippedTest(attrs = {}) {
  const title = fakeTitle();
  return {
    ...baseTest,
    title,
    fullTitle: title,
    code: '(1+1).should.equal(2);',
    uuid: faker.random.uuid(),
    parentUUID: faker.random.uuid(),
    ...testStates.skipped,
    ...attrs,
  };
}

function suite(attrs = {}) {
  const title = fakeTitle();
  const { file, fullFile } = fakeFile();
  return {
    uuid: '',
    title,
    fullFile,
    file,
    beforeHooks: [],
    afterHooks: [],
    tests: [],
    suites: [],
    passes: [],
    failures: [],
    pending: [],
    skipped: [],
    duration: 0,
    root: false,
    rootEmpty: true,
    _timeout: 2000,
    ...attrs,
  };
}

function countStuff(countSuite, counts) {
  if (!counts) {
    counts = {
      suites: 0,
      tests: 0,
      passes: 0,
      pending: 0,
      failures: 0,
      skipped: 0,
      other: 0,
      duration: 0,
      testsRegistered: 0,
    };
  }

  // Count failed hooks
  const hasFailedBefore = countSuite.beforeHooks.some(isFailingTest);
  let hasFailedAfterEach = false;
  const failedAfters = countSuite.afterHooks.reduce((acc, hook) => {
    const isFailing = isFailingTest(hook);
    if (isFailing && hook.title.includes('each')) {
      hasFailedAfterEach = true;
    }
    acc += isFailing ? 1 : 0;
    return acc;
  }, 0);
  counts.other = failedAfters + (hasFailedBefore ? 1 : 0);

  // SUM duration
  counts.duration += countSuite.duration;

  // Count tests and testsRegistered
  if (hasFailedBefore) {
    counts.tests += 0;
  } else if (hasFailedAfterEach) {
    counts.tests = 1;
  } else {
    counts.tests += countSuite.tests.length;
  }
  counts.testsRegistered += countSuite.tests.length;

  // Count array lenghts
  ['suites', 'passes', 'pending', 'failures', 'skipped'].forEach(arrayType => {
    counts[arrayType] += countSuite[arrayType].length;
  });

  if (countSuite.suites.length) {
    countSuite.suites.forEach(s => {
      countStuff(s, counts);
    });
  }

  return counts;
}

function stats(rootSuite, attrs = {}) {
  const counts = countStuff(rootSuite);
  return {
    suites: counts.suites,
    tests: counts.tests,
    passes: counts.passes,
    pending: counts.pending,
    failures: counts.failures,
    start: '2018-10-31T15:29:13.967Z',
    end: '2018-10-31T15:29:14.967Z',
    duration: counts.duration,
    testsRegistered: counts.testsRegistered,
    passPercent:
      Math.round(
        (counts.passes / (counts.testsRegistered - counts.pending)) * 1000
      ) / 10,
    pendingPercent:
      Math.round((counts.pending / counts.testsRegistered) * 1000) / 10,
    other: counts.other,
    hasOther: counts.other > 0,
    skipped: counts.skipped,
    hasSkipped: counts.skipped > 0,
    ...attrs,
  };
}

function filterTestIds(testsArr, filterFn) {
  return testsArr.reduce((acc, test) => {
    if (filterFn(test)) {
      acc.push(test.uuid);
    }
    return acc;
  }, []);
}

function isPassingTest(test) {
  return test.pass;
}
function isFailingTest(test) {
  return test.fail || test.state === 'failed';
}
function isPendingTest(test) {
  return test.pending;
}
function isSkippedTest(test) {
  return test.skipped;
}

/**
 * Build out a fake suite with given attributes
 *
 * @param {object} attrs
 * @param {array} attrs.hooks Array of hooks
 * @param {array} attrs.tests Array of tests
 * @param {array} attrs.suites Array of nested suites
 * @param {bool} attrs.isRoot Create a root suite
 *
 * @return {object} Suite object
 */
function makeSuite({ hooks = [], tests = [], suites = [], isRoot = false }) {
  // Generate the suite UUID
  const uuid = faker.random.uuid();

  // Sort the hooks
  let hasFailedBefore = false;
  let hasFailedAfterEach = false;
  const beforeHooks = [];
  const afterHooks = [];
  hooks.forEach(h => {
    if (h.title.includes('before')) {
      beforeHooks.push(h);
      if (isFailingTest(h)) {
        hasFailedBefore = true;
      }
    }
    if (h.title.includes('after')) {
      afterHooks.push(h);
      if (isFailingTest(h) && h.title.includes('each')) {
        hasFailedAfterEach = true;
      }
    }
  });

  // Modify tests to have correct attributes based
  // on the state of other properties in the suite
  const newTests = tests.map((t, index) => {
    // A failed `before` hook causes all tests to be skipped
    if (hasFailedBefore) {
      return { ...t, parentUUID: uuid, ...testStates.skipped };
    }
    // A failed `afterEach` hook causes all but the first test to be skipped
    if (hasFailedAfterEach && index !== 0) {
      return { ...t, parentUUID: uuid, ...testStates.skipped };
    }
    return { ...t, parentUUID: uuid };
  });
  const allTests = []
    .concat(beforeHooks)
    .concat(afterHooks)
    .concat(newTests);

  const duration = tests.reduce((acc, t) => {
    acc += t.duration;
    return acc;
  }, 0);

  let attrs = {
    beforeHooks,
    afterHooks,
    tests: newTests,
    suites,
    passes: filterTestIds(newTests, isPassingTest),
    failures: filterTestIds(newTests, isFailingTest),
    pending: filterTestIds(newTests, isPendingTest),
    skipped: filterTestIds(newTests, isSkippedTest),
    duration: hasFailedBefore ? null : duration,
    rootEmpty: allTests.length === 0,
    root: isRoot,
    uuid,
  };

  if (isRoot) {
    attrs = {
      ...attrs,
      title: '',
      file: '',
      fullFile: '',
    };
  }

  return suite(attrs);
}

/**
 * Build out a fake test of given type
 *
 * @param {string} type Test type [passed|failed|pending|skipped]
 * @param {object} options Test options
 * @param {boolean} options.timedOut Indicates whether test has timed out (Failing tests only)
 * @param {string} options.speed Set the speed of the test [slow|medium|fast]
 * @param {bool|string|object} options.context Set the context for a test (default: false)
   - If `true` is passed, the test will be assigned a random type of context
 * @param {string} options.hook Set the type of hook [before|beforeEach|after|afterEach]
 *
 * @return {object} Test object
 */
function makeTest(type, options = {}) {
  const testFns = {
    passed: passingTest,
    failed: failingTest,
    pending: pendingTest,
    skipped: skippedTest,
  };
  const types = Object.keys(testStates);
  const speeds = Object.keys(testSpeeds);
  const hooks = Object.keys(hookStates);

  if (!types.includes(type)) {
    throw new Error(`Cannot make test of type: ${type}`);
  }
  let attrs = {};

  // Handle `timedOut` option
  if (type === 'failed' && options.timedOut) {
    attrs = {
      ...timedOut(),
    };
  }

  // Handle `speed` option
  if (options.speed && speeds.includes(options.speed)) {
    attrs.speed = options.speed;
    attrs.duration = testSpeeds[options.speed];
  }

  // Handle `context` option
  if (type === 'passed' || type === 'failed') {
    if (options.context === true) {
      attrs.context = fakeContext();
    } else if (typeof options.context === 'object') {
      attrs.context = JSON.stringify(options.context);
    } else if (options.context !== undefined) {
      attrs.context = options.context;
    }
  }

  // Handle `hook` option
  if (options.hook && hooks.includes(options.hook)) {
    attrs = {
      ...attrs,
      ...hookStates[options.hook],
    };

    if (type === 'failed') {
      attrs = {
        ...attrs,
        ...failedHookState,
      };
    }
  }

  return testFns[type](attrs);
}

const testsParseMap = {
  passed: () => makeTest('passed'),
  failed: () => makeTest('failed'),
  pending: () => makeTest('pending'),
};

const hooksParseMap = {
  before: () => makeTest('passed', { hook: 'before' }),
  beforeEach: () => makeTest('passed', { hook: 'beforeEach' }),
  after: () => makeTest('passed', { hook: 'after' }),
  afterEach: () => makeTest('passed', { hook: 'afterEach' }),
  failedBefore: () => makeTest('failed', { hook: 'before' }),
  failedBeforeEach: () => makeTest('failed', { hook: 'beforeEach' }),
  failedAfter: () => makeTest('failed', { hook: 'after' }),
  failedAfterEach: () => makeTest('failed', { hook: 'afterEach' }),
};

/**
 * Parse a shorthand suite definition and return an object
 * to be passed to `makeSuite`
 *
 * @param {array} def Shorthand definition
 * @param {bool} isRoot
 *
 * @return {object} `makeSuite` object parameter
 */
function parseSuite(def, isRoot = false) {
  return def.reduce(
    (acc, suiteDef) => {
      if (Array.isArray(suiteDef)) {
        acc.suites.push(makeSuite(parseSuite(suiteDef)));
      } else if (typeof suiteDef === 'object') {
        acc[suiteDef.isHook ? 'hook' : 'tests'].push(suiteDef);
      } else if (typeof suiteDef === 'string') {
        if (hooksParseMap[suiteDef]) {
          acc.hooks.push(hooksParseMap[suiteDef]());
        } else if (testsParseMap[suiteDef]) {
          acc.tests.push(testsParseMap[suiteDef]());
        }
      }

      return acc;
    },
    { hooks: [], tests: [], suites: [], isRoot }
  );
}

/**
 * Build out a fake report with given suites and options
 *
 * @param {array|object} suites Suites definition
 * @param {object} mochawesomeOpts Mochawesome options
 * @param {object} margeOpts Marge options
 *
 * @return {object} Report object
 */
function makeReport(suites, mochawesomeOpts = {}, margeOpts = {}) {
  const rootSuite = Array.isArray(suites)
    ? makeSuite(parseSuite(suites, true))
    : suites;

  return {
    stats: stats(rootSuite),
    results: [rootSuite],
    meta: {
      mocha: {
        version: fakeVersion(),
      },
      mochawesome: {
        options: mochawesomeOpts,
        version: fakeVersion(),
      },
      marge: {
        options: margeOpts,
        version: fakeVersion(),
      },
    },
  };
}

module.exports = {
  makeTest,
  makeSuite,
  makeReport,
  parseSuite,
  PASSED,
  FAILED,
  PENDING,
  BEFORE,
  BEFORE_EACH,
  AFTER,
  AFTER_EACH,
  FAILED_BEFORE,
  FAILED_BEFORE_EACH,
  FAILED_AFTER,
  FAILED_AFTER_EACH,
};
