import React from 'react';
import ReactDOM from 'react-dom';
import { MochawesomeReport } from 'components';
import reportStore from './reportStore';


// Clean up the DOM
const initDataScriptEl = document.getElementById('init-data');
initDataScriptEl.parentNode.removeChild(initDataScriptEl);

// Set data in the store
const { data, config } = window.MOCHAWESOME;
reportStore.setInitialData({ data, config });

// Render the report
ReactDOM.render(
  React.createElement(MochawesomeReport, { store: reportStore }),
  document.getElementById('report')
);
