import React from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js/lib/highlight';

import App from './App';
import ReportStore from './reportStore';

// Register hljs languages
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);
hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'));

// Initialize the store
const bodyEl = document.querySelector('body');
const data = JSON.parse(bodyEl.getAttribute('data-raw'));
const config = JSON.parse(bodyEl.getAttribute('data-config'));
const store = new ReportStore(data, config);

// Clean up the DOM
bodyEl.removeAttribute('data-raw');
bodyEl.removeAttribute('data-config');

// Add global reference to the store
window.marge = store;

ReactDOM.render(
  <App store={store} />,
  document.getElementById('report')
);
