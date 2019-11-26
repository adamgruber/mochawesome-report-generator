import React from 'react';
import PropTypes from 'prop-types';
import { Provider, observer } from 'mobx-react';
import { withRouter } from "react-router";
import { Footer, Navbar } from 'components';
import { NavMenu } from 'components/nav-menu';
import 'styles/app.global.css';
import MobxDevTool from './mobxDevtool';

const ReportDetail = observer(props => {
  const {store, history} = props
  const { devMode, VERSION, reportTitle, stats } = store;

  return (
    <Provider reportStore={props.store}>
      <main>
        <Navbar
          onMenuClick={() => {
            history.goBack()
          }}
          stats={stats}
          showQuickSummary={false}
          icon="arrow_back"
          reportTitle={reportTitle}
        />
        ReportDetail
        <Footer version={VERSION} />
        <NavMenu />
        {devMode && <MobxDevTool position={{ bottom: 0, right: 20 }} />}
      </main>
    </Provider>
  );
});

ReportDetail.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object
};

ReportDetail.displayName = 'ReportDetail';

export default withRouter(ReportDetail);
