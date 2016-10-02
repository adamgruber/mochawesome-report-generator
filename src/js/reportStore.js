/* eslint-disable no-console, max-len */
import { observable, computed, action } from 'mobx';
// import find from 'lodash/find';
import filter from 'lodash/filter';
import map from 'lodash/map';
import compact from 'lodash/compact';

class ReportStore {
  @observable showQuickSummary = false;
  @observable sideNavOpen = true;
  @observable showPassed = true;
  @observable showFailed = true;
  @observable showPending = true;
  @observable showSkipped = false;
  @observable visibleTests = [];
  @observable visibleSuites = [];

  constructor(data = {}) {
    this.data = data;
    this.filterDropdownList = [
      { title: 'Passed' },
      { title: 'Failed' },
      { title: 'Pending' },
      { title: 'Skipped' }
    ];
  }

  @computed get suites() {
    const derived = compact(map(this.allSuites, this._mapSuites));
    console.log(derived);
    return derived;
  }

  @action openSideNav() {
    this.sideNavOpen = true;
  }

  @action closeSideNav() {
    this.sideNavOpen = false;
  }

  _mapSuites = suite => {
    const suites = compact(map(suite.suites, this._mapSuites));
    const tests = filter(suite.tests, test => (
      (this.showPassed && test.pass)
      || (this.showFailed && test.fail)
      || (this.showPending && test.pending)
      || (this.showSkipped && test.skipped)
    ));

    return (tests.length > 0 || suites.length > 0)
      ? Object.assign({}, suite, { suites, tests })
      : null;
  }

  _testShouldDisplay = test => {
    const { pass, fail, pending, skipped } = test;
    return (this.showPassed && pass)
      || (this.showFailed && fail)
      || (this.showPending && pending)
      || (this.showSkipped && skipped);
  }

  setInitialData({ data, config }) {
    const reportTitle = config.reportTitle || data.reportTitle;
    Object.assign(this, { reportTitle, data, config });
    this.allSuites = [ data.suites ];
    this.stats = data.stats;
  }
}

const reportStore = new ReportStore();

window.reportStore = reportStore;

export default reportStore;

export { ReportStore };
