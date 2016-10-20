import React from 'react';
import DevTools from 'mobx-react-devtools';
import { observer } from 'mobx-react';
import { Footer, Navbar } from 'components';
import { NavMenu } from 'components/nav-menu';
import { Suite } from 'components/suite';
import cx from 'classnames';
import 'styles/app.global.css';
import reportStore from '../js/reportStore';

const MochawesomeReport = observer(() => {
  const { reportTitle, suites, allSuites, stats, enableChart, enableCode,
    showPassed, showFailed, showPending, showSkipped, sideNavOpen } = reportStore;

  const navMenuProps = {
    reportTitle,
    stats,
    showPassed,
    showFailed,
    showPending,
    showSkipped,
    sideNavOpen
  };

  return (
    <div>
      <Navbar reportTitle={ reportTitle } stats={ stats } />
      <div id='details' className={ cx('details', 'container') }>
        { suites.map(suite => (
          <Suite
            key={ suite.uuid }
            suite={ suite }
            enableChart={ enableChart }
            enableCode={ enableCode } />)
        ) }
      </div>
      <Footer />
      <NavMenu suites={ allSuites } { ...navMenuProps } />
      <DevTools position={ { bottom: 0, right: 20 } } />
    </div>
  );
});

MochawesomeReport.displayName = 'MochawesomeReport';

export default MochawesomeReport;
