/* eslint-disable no-console, max-len */
import { observable, computed, action } from 'mobx';
// import find from 'lodash/find';
import filter from 'lodash/filter';
import map from 'lodash/map';
import compact from 'lodash/compact';

class ReportStore {
  @observable showQuickSummary = false;
  @observable sideNavOpen = false;
  @observable showPassed = true;
  @observable showFailed = true;
  @observable showPending = true;
  @observable visibleTests = [];
  @observable visibleSuites = [];

  constructor(data = {}) {
    this.data = data;
    this.filterDropdownList = [
      { title: 'Passed' },
      { title: 'Failed' },
      { title: 'Pending' }
    ];
  }

  @computed get suites() {
    const derived = compact(map(this.allSuites, this._mapSuites.bind(this)));
    console.log(derived);
    return derived;
  }

  @action openSideNav() {
    this.sideNavOpen = true;
  }

  @action closeSideNav() {
    this.sideNavOpen = false;
  }

  _mapSuites(suite) {
    const suites = compact(map(suite.suites, this._mapSuites.bind(this)));
    const tests = filter(suite.tests, test => (
      (this.showPassed && test.pass)
      || (this.showFailed && test.fail)
      || (this.showPending && test.pending)
    ));

    return (tests.length > 0 || suites.length > 0)
      ? Object.assign({}, suite, { suites, tests })
      : null;

    // const newSuite = Object.assign({}, suite, {
    //   suites: mappedSuites,
    //   tests: filteredTests
    // });

    // console.group(newSuite.title);
    // console.log(`hasTests: ${newSuite.hasTests}, hasSuites: ${newSuite.hasSuites}`)
    // console.log(`displayTests: ${newSuite.tests && newSuite.tests.length}, displaySuites: ${newSuite.suites && newSuite.suites.length}\n`);
    // console.groupEnd();
  }

  setInitialData({ data, config }) {
    const reportTitle = config.reportTitle || data.reportTitle;
    Object.assign(this, { reportTitle, data, config });
    this.allSuites = [ data.suites ];
  }

  _filterSuites(suite) {
    suite.displaySuites = filter(suite.suites, this._filterSuites.bind(this));
    suite.displayTests = filter(suite.tests, test => (
      (this.showPassed && test.pass)
      || (this.showFailed && test.fail)
      || (this.showPending && test.pending)
    ));

    // console.group(suite.title);
    // console.log(`hasTests: ${suite.hasTests}, hasSuites: ${suite.hasSuites}`)
    // console.log(`displayTests: ${suite.displayTests && suite.displayTests.length}, displaySuites: ${suite.displaySuites && suite.displaySuites.length}\n`);
    // console.groupEnd();

    // Return a suite if it has tests or suites to display
    return (suite.displayTests.length > 0 || suite.displaySuites.length > 0);
  }
}

const reportStore = new ReportStore();

window.reportStore = reportStore;

export default reportStore;

export { ReportStore };
