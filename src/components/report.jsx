import React from 'react';
import DevTools from 'mobx-react-devtools';
import { observer } from 'mobx-react';
import { Suite } from 'components/suite';
import cx from 'classnames';
import 'styles/app.global.css';
import { Footer, Navbar, NavMenu } from './index';
import reportStore from '../js/reportStore';

const MochawesomeReport = observer(() => {
  const { reportTitle, suites, allSuites, stats, showChart } = reportStore;
  return (
    <div>
      <Navbar reportTitle={ reportTitle } stats={ stats } />
      <div id='details' className={ cx('details', 'container') }>
        { suites.map(suite => (
          <Suite
            key={ suite.uuid }
            suite={ suite }
            showChart={ showChart } />)
        ) }
      </div>
      <Footer />
      <NavMenu reportTitle={ reportTitle } stats={ stats } suites={ allSuites } />
      <DevTools position={ { bottom: 0, right: 20 } } />
    </div>
  );
});

export default MochawesomeReport;
