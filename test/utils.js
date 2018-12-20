/* eslint-disable import/prefer-default-export */
import ReportStore from 'js/reportStore';

export const createStore = (data = {}, config = {}) =>
  new ReportStore(data, config);
