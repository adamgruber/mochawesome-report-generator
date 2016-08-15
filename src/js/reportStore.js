import { observable } from 'mobx';

class ReportStore {
  @observable showQuickSummary = false;
  @observable sideNavOpen = false;

  constructor(data = {}) {
    this.data = data;
  }

  setInitialData({ data, config }) {
    const reportTitle = config.reportTitle || data.reportTitle;
    Object.assign(this, { reportTitle, data, config });
  }
}

const reportStore = new ReportStore();

window.reportStore = reportStore;

export default reportStore;

export { ReportStore };
