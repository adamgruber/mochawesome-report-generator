import React from 'react';
import ReactDOM from 'react-dom';
import { MochawesomeReport } from 'components';
import reportStore from './reportStore';

const bodyEl = document.querySelector('body');
const data = JSON.parse(bodyEl.getAttribute('data-raw'));
const config = JSON.parse(bodyEl.getAttribute('data-config'));

bodyEl.removeAttribute('data-raw');
bodyEl.removeAttribute('data-config');

// Set data in the store
reportStore.setInitialData({ data, config });

ReactDOM.render(
  React.createElement(MochawesomeReport, { store: reportStore }),
  document.getElementById('report')
);
