import React from 'react';
import ReactDOM from 'react-dom';
import { MochawesomeReport } from 'components';
import hljs from 'highlight.js/lib/highlight';
import reportStore from './reportStore';

const bodyEl = document.querySelector('body');
const data = JSON.parse(bodyEl.getAttribute('data-raw'));
const config = JSON.parse(bodyEl.getAttribute('data-config'));

// Add global reference to the store
window.marge = reportStore;

// Register hljs languages
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'));

bodyEl.removeAttribute('data-raw');
bodyEl.removeAttribute('data-config');

// Set data in the store
reportStore.setInitialData({ data, config });

ReactDOM.render(
  React.createElement(MochawesomeReport, { store: reportStore }),
  document.getElementById('report')
);
