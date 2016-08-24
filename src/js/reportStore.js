/* eslint-disable no-console, max-len */
import { observable, computed } from 'mobx';
// import find from 'lodash/find';
import filter from 'lodash/filter';

class ReportStore {
  @observable showQuickSummary = false;
  @observable sideNavOpen = false;
  @observable showPassed = false;
  @observable showFailed = false;
  @observable showPending = false;

  constructor(data = {}) {
    this.data = data;
    this.filterDropdownList = [
      { title: 'Passed' },
      { title: 'Failed' },
      { title: 'Pending' }
    ];
  }

  @computed get suites() {
    // TODO: turn this into a map
    const derived = filter(this.allSuites, this._filterSuites.bind(this));
    console.log(derived);
    return derived;
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
