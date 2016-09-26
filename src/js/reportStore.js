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
    ));

    return (tests.length > 0 || suites.length > 0)
      ? Object.assign({}, suite, { suites, tests })
      : null;
  }

  _testShouldDisplay = test => {
    const { pass, fail, pending } = test;
    return (this.showPassed && pass) || (this.showFailed && fail) || (this.showPending && pending);
  }

  _mapSuites2 = suite => {
    map(suite.suites, this._mapSuites2);
    const displayTests = filter(suite.tests, this._testShouldDisplay);
    map(suite.tests, test => {
      test.visible = this._testShouldDisplay(test);
      return test;
    });

    suite.visible = displayTests.length > 0 || map(suite.suites, { visible: true }).length > 0;

    return suite;

    // return (displayTests.length > 0 || suites.length > 0)
    //   ? Object.assign({}, suite, { suites })
    //   : null;
  }

  setInitialData({ data, config }) {
    const reportTitle = config.reportTitle || data.reportTitle;
    Object.assign(this, { reportTitle, data, config });
    this.allSuites = [ data.suites ];
  }
}

const reportStore = new ReportStore();

window.reportStore = reportStore;

export default reportStore;

export { ReportStore };
