/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import DevTools from 'mobx-react-devtools';
import { Provider, observer } from 'mobx-react';
import { Footer, Navbar, ReportBody } from 'components';
import { NavMenu } from 'components/nav-menu';
import 'styles/app.global.css';

const MochawesomeReport = observer(props => {
  const {
    reportTitle,
    allSuites,
    stats,
    showPassed,
    showFailed,
    showPending,
    showSkipped,
    showHooks,
    sideNavOpen,
    devMode
  } = props.store;

  const navMenuProps = {
    reportTitle,
    stats,
    showPassed,
    showFailed,
    showPending,
    showSkipped,
    showHooks,
    sideNavOpen
  };

  return (
    <Provider reportStore={ props.store }>
      <main>
        <Navbar
          reportTitle={ reportTitle }
          stats={ stats } />
        <ReportBody />
        <Footer />
        <NavMenu suites={ allSuites } { ...navMenuProps } />
        { devMode && <DevTools position={ { bottom: 0, right: 20 } } /> }
      </main>
    </Provider>
  );
});

MochawesomeReport.propTypes = {
  store: PropTypes.object
};

MochawesomeReport.displayName = 'MochawesomeReport';

export default MochawesomeReport;
