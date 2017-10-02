import { observable, computed, action } from 'mobx';
import filter from 'lodash/filter';
import map from 'lodash/map';
import compact from 'lodash/compact';

class ReportStore {
  @observable sideNavOpen = false;
  @observable showPassed = true;
  @observable showFailed = true;
  @observable showPending = true;
  @observable showSkipped = false;
  @observable quickSummaryWidth = null;
  @observable windowWidth = null;
  @observable showHooks = 'failed';

  constructor(data = {}) {
    this.data = data;
    this.showHooksOptions = [ 'failed', 'always', 'never', 'context' ];
    this.filterOptions = [ 'all', 'passed', 'failed', 'pending', 'skipped' ];
  }

  @computed get suites() {
    const derived = compact(map(this.allSuites, this._mapSuites));
    return derived;
  }

  @computed get mobileBreakpoint() {
    return this.windowWidth < 768;
  }

  @action openSideNav() {
    this.sideNavOpen = true;
  }

  @action closeSideNav() {
    this.sideNavOpen = false;
  }

  @action toggleFilter(prop) {
    this[prop] = !this[prop];
  }

  @action setShowHooks(prop) {
    if (this._isValidShowHookOption(prop)) {
      this.showHooks = prop;
    }
  }

  @action setQuickSummaryWidth(width) {
    this.quickSummaryWidth = width;
  }

  @action setWindowWidth(width) {
    this.windowWidth = width;
  }

  _filterHook = hook => (
      (this.showHooks === 'always')
      || (this.showHooks === 'failed' && hook.fail)
      || (this.showHooks === 'context' && hook.context)
  )

  _mapSuites = suite => {
    const suites = compact(map(suite.suites, this._mapSuites));
    const tests = filter(suite.tests, test => (
      (this.showPassed && test.pass)
      || (this.showFailed && test.fail)
      || (this.showPending && test.pending)
      || (this.showSkipped && test.skipped)
    ));

    const beforeHooks = filter(suite.beforeHooks, this._filterHook);
    const afterHooks = filter(suite.afterHooks, this._filterHook);

    return (beforeHooks.length || afterHooks.length || tests.length || suites.length)
      ? Object.assign({}, suite, { suites, beforeHooks, afterHooks, tests })
      : null;
  }

  _isValidOption = (property, options, selection) => {
    const isValid = options.indexOf(selection) >= 0;
    if (!isValid) {
      console.error(`Warning: '${selection}' is not a valid option for property: '${property}'. Valid options are: ${options.join(', ')}`); // eslint-disable-line
    }
    return isValid;
  };

  _isValidShowHookOption = option => (
    this._isValidOption('showHooks', this.showHooksOptions, option)
  );

  _isValidFilterOption = option => (
    this._isValidOption('filter', this.filterOptions, option)
  );

  _getShowHooks = ({ showHooks }) => {
    if (!showHooks) {
      return this.showHooks;
    }
    return this._isValidShowHookOption(showHooks) ? showHooks : this.showHooks;
  };

  _setFilterState = filters => {
    if (!filters) {
      return;
    }

    const splittedFilters = filters.split(',');
    const validFilters = this._getValidFilters(splittedFilters);

    // It will leave the current filter state if there comes 'all' in the filter parameter.
    if (!validFilters.includes('all') && validFilters.length > 0) {
      this.showPassed = validFilters.includes('passed');
      this.showFailed = validFilters.includes('failed');
      this.showPending = validFilters.includes('pending');
      this.showSkipped = validFilters.includes('skipped');
    }
  };

  _getValidFilters = filters =>
    filters.filter(reportFilter => this._isValidFilterOption(reportFilter));

  setInitialData({ data, config }) {
    const reportTitle = config.reportTitle || data.reportTitle;
    const showHooks = this._getShowHooks(config);
    this._setFilterState(config.filter);

    Object.assign(this, { data, ...config, reportTitle, showHooks });
    this.allSuites = [ data.suites ];
    this.stats = data.stats;
    this.enableChart = !!config.enableCharts;
    this.devMode = !!config.dev;
  }
}

const reportStore = new ReportStore();
window.reportStore = reportStore;
export default reportStore;

export { ReportStore };
