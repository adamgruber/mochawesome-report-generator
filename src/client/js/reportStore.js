import { extendObservable, observable, action } from 'mobx';

const transduce = (items, mapper, reducer, initial) =>
  items.reduce(
    (acc, item, index) => reducer(acc, mapper(item, index), index),
    initial
  );

class ReportStore {
  constructor(data = {}, config = {}) {
    Object.assign(this, {
      devMode: !!config.dev,
      enableChart: !!config.enableCharts,
      enableCode: !!config.enableCode,
      initialLoadTimeout: 300,
      reportTitle: config.reportTitle || data.reportTitle,
      results: data.results || [],
      showHooksOptions: ['failed', 'always', 'never', 'context'],
      stats: data.stats || {},
      VERSION: '__VERSION__',
      e2eMedia: data.e2eMedia || {}
    });

    extendObservable(this, {
      filteredSuites: [],
      isLoading: true,
      showFailed: config.showFailed !== undefined ? config.showFailed : true,
      showHooks: this._getShowHooks(config),
      showPassed: config.showPassed !== undefined ? config.showPassed : true,
      showPending: config.showPending !== undefined ? config.showPending : true,
      showSkipped:
        config.showSkipped !== undefined ? config.showSkipped : false,
      sideNavOpen: false,
    }, {
      filteredSuites: observable.shallow
    });
  }

  @action.bound
  openSideNav() {
    this.sideNavOpen = true;
  }

  @action.bound
  closeSideNav() {
    this.sideNavOpen = false;
  }

  @action.bound
  toggleFilter(prop) {
    this.toggleIsLoading(true);
    this[prop] = !this[prop];
  }

  @action.bound
  setShowHooks(prop) {
    if (this._isValidShowHookOption(prop)) {
      this.toggleIsLoading(true);
      this.showHooks = prop;
    }
  }

  @action
  toggleIsLoading(isLoading) {
    this.isLoading = isLoading !== undefined ? isLoading : !this.isLoading;
  }

  _mapHook = hook =>
    (this.showHooks === 'always' ||
      (this.showHooks === 'failed' && hook.fail) ||
      (this.showHooks === 'context' && hook.context)) &&
    hook;

  _mapTest = test =>
    ((this.showPassed && test.pass) ||
      (this.showFailed && test.fail) ||
      (this.showPending && test.pending) ||
      (this.showSkipped && test.skipped)) &&
    test;

  _mapSuite = suite => {
    const suites = suite.suites.length
      ? this._getFilteredTests(suite.suites)
      : [];
    const tests = transduce(suite.tests, this._mapTest, this._reduceItem, []);
    const beforeHooks = transduce(
      suite.beforeHooks,
      this._mapHook,
      this._reduceItem,
      []
    );
    const afterHooks = transduce(
      suite.afterHooks,
      this._mapHook,
      this._reduceItem,
      []
    );

    return beforeHooks.length ||
      afterHooks.length ||
      tests.length ||
      suites.length
      ? Object.assign({}, suite, { suites, beforeHooks, afterHooks, tests })
      : null;
  };

  _reduceItem = (acc, item) => {
    if (item) {
      acc.push(item);
    }
    return acc;
  };

  _getFilteredTests = suite =>
    transduce(suite, this._mapSuite, this._reduceItem, []);

  _isValidOption = (property, options, selection) => {
    const isValid = options.indexOf(selection) >= 0;
    if (!isValid) {
      console.error(
        `Warning: '${selection}' is not a valid option for property: '${property}'. Valid options are: ${options.join(
          ', '
        )}`
      ); // eslint-disable-line
    }
    return isValid;
  };

  _isValidShowHookOption = option =>
    this._isValidOption('showHooks', this.showHooksOptions, option);

  _getShowHooks = ({ showHooks }) => {
    const showHooksDefault = 'failed';

    if (!showHooks) {
      return showHooksDefault;
    }

    return this._isValidShowHookOption(showHooks)
      ? showHooks
      : showHooksDefault;
  };

  updateFilteredSuites(timeout = this.initialLoadTimeout) {
    setTimeout(() => {
      this.toggleIsLoading(false);
      this.filteredSuites = this._getFilteredTests(this.results);
    }, timeout);
  }
}

export default ReportStore;
