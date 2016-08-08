import { observable } from 'mobx';

class ReportStore {
  @observable data;
  @observable sideNavOpen = false;

  constructor(data = {}) {
    this.data = data;
  }
}

const reportStore = new ReportStore();

export default reportStore;

export { ReportStore };
