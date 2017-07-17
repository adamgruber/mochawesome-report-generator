/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import DevTools from 'mobx-react-devtools';
import { Provider, observer } from 'mobx-react';
import { Footer, Navbar } from 'components';
import { NavMenu } from 'components/nav-menu';
import { Suite } from 'components/suite';
import cx from 'classnames';
import 'styles/app.global.css';

const MochawesomeReport = observer(props => {
  const {
    reportTitle,
    suites,
    allSuites,
    stats,
    enableChart,
    enableCode,
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
      <div>
        <Navbar
          reportTitle={ reportTitle }
          stats={ stats } />
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
        { devMode && <DevTools position={ { bottom: 0, right: 20 } } /> }
      </div>
    </Provider>
  );
});

MochawesomeReport.propTypes = {
  store: PropTypes.object
};

MochawesomeReport.displayName = 'MochawesomeReport';

export default MochawesomeReport;
