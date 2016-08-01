import React from 'react';
import ReactDOM from 'react-dom';
import { MochawesomeReport } from '../components';

const bodyEl = document.querySelector('body');
const data = JSON.parse(bodyEl.getAttribute('data-raw'));
const config = JSON.parse(bodyEl.getAttribute('data-config'));

bodyEl.removeAttribute('data-raw');
bodyEl.removeAttribute('data-config');

ReactDOM.render(
  <MochawesomeReport data={ data } config={ config } />,
  document.getElementById('report')
);
