'use strict';

var t = require('tcomb');

var _require = require('validator'),
    isUUID = _require.isUUID,
    isISO8601 = _require.isISO8601;

var PercentClass = t.enums.of(['success', 'warning', 'danger'], 'PercentClass');
var TestState = t.enums.of(['passed', 'failed'], 'TestState');
var TestSpeed = t.enums.of(['slow', 'medium', 'fast'], 'TestSpeed');
var DateString = t.refinement(t.String, isISO8601, 'DateString');
var Uuid = t.refinement(t.String, isUUID, 'UUID');

var Test = t.struct({
  title: t.String,
  fullTitle: t.String,
  timedOut: t.Boolean,
  duration: t.Integer,
  state: t.maybe(TestState),
  speed: t.maybe(TestSpeed),
  pass: t.Boolean,
  fail: t.Boolean,
  pending: t.Boolean,
  code: t.String,
  err: t.Object,
  isRoot: t.Boolean,
  uuid: Uuid,
  parentUUID: t.maybe(Uuid),
  skipped: t.Boolean,
  context: t.maybe(t.String)
});

var Suite = t.declare('Suite');
Suite.define(t.struct({
  title: t.String,
  suites: t.list(Suite),
  tests: t.list(Test),
  pending: t.list(Test),
  root: t.Boolean,
  _timeout: t.Integer,
  file: t.String,
  uuid: Uuid,
  fullFile: t.String,
  passes: t.list(Test),
  failures: t.list(Test),
  skipped: t.list(Test),
  totalTests: t.Integer,
  totalPasses: t.Integer,
  totalFailures: t.Integer,
  totalPending: t.Integer,
  totalSkipped: t.Integer,
  hasTests: t.Boolean,
  hasSuites: t.Boolean,
  hasPasses: t.Boolean,
  hasFailures: t.Boolean,
  hasPending: t.Boolean,
  hasSkipped: t.Boolean,
  duration: t.Integer,
  rootEmpty: t.maybe(t.Boolean)
}));

var TestReport = t.struct({
  stats: t.struct({
    suites: t.Integer,
    tests: t.Integer,
    passes: t.Integer,
    pending: t.Integer,
    failures: t.Integer,
    start: DateString,
    end: DateString,
    duration: t.Integer,
    testsRegistered: t.Integer,
    passPercent: t.Number,
    pendingPercent: t.Number,
    other: t.Integer,
    hasOther: t.Boolean,
    skipped: t.Integer,
    hasSkipped: t.Boolean,
    passPercentClass: PercentClass,
    pendingPercentClass: PercentClass,
    context: t.maybe(t.String)
  }),
  suites: Suite,
  allTests: t.list(Test),
  allPending: t.list(Test),
  allPasses: t.list(Test),
  allFailures: t.list(Test),
  copyrightYear: t.Integer
});

module.exports = { TestReport: TestReport };