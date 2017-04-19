import React from 'react';
import ReactDOM from 'react-dom';
import { MochawesomeReport } from 'components';
import hljs from 'highlight.js/lib/highlight';
import reportStore from './reportStore';

// Clean up the DOM
const initDataScriptEl = document.getElementById('init-data');
initDataScriptEl.parentNode.removeChild(initDataScriptEl);

// Register hljs languages
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'));

// Set data in the store
const { data, config } = window.MOCHAWESOME;
reportStore.setInitialData({ data, config });

// Render the report
ReactDOM.render(
  React.createElement(MochawesomeReport, { store: reportStore }),
  document.getElementById('report')
);
