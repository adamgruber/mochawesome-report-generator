/* eslint-disable import/prefer-default-export */

import { ReportStore } from 'js/reportStore';

export const createStore = (data = {}, config = {}) => {
  const store = new ReportStore();
  store.setInitialData({ data, config });
  return store;
};
