import React from 'react';
import PropTypes from 'prop-types';
import { Provider, observer } from 'mobx-react';
import { Footer, Loader, Navbar, ReportBody } from 'components';
import { NavMenu } from 'components/nav-menu';
import 'styles/app.global.css';
import MobxDevTool from './mobxDevtool';

const MochawesomeReport = observer(props => {
  const {
    openSideNav,
    toggleSingleFilter,
    singleFilter,
    reportTitle,
    stats,
    devMode,
    VERSION
  } = props.store;

  return (
    <Provider reportStore={props.store}>
      <main>
        <Navbar
          onMenuClick={openSideNav}
          onQuickFilterClick={toggleSingleFilter}
          singleFilter={singleFilter}
          reportTitle={reportTitle}
          stats={stats}
        />
        <ReportBody />
        <Loader />
        <Footer version={VERSION} />
        <NavMenu />

        {/* DevTool removed → keep call but with no props */}
        {devMode && <MobxDevTool />}
      </main>
    </Provider>
  );
});

MochawesomeReport.propTypes = {
  store: PropTypes.object,
};

MochawesomeReport.displayName = 'MochawesomeReport';

export default MochawesomeReport;
