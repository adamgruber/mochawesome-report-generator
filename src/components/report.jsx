import React, { Component, PropTypes } from 'react';
import DevTools from 'mobx-react-devtools';
import throttle from 'lodash/throttle';
import { observer } from 'mobx-react';
import reportStore from '../js/reportStore';
import { DomNodeWrapper, Footer, Navbar, NavMenu, Summary, StatusBar } from './index';
import { SuiteList } from 'components/suite';
import cx from 'classnames';
import 'styles/app.global.css';

@observer
class MochawesomeReport extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  state = {};

  componentDidMount() {
    window.addEventListener('scroll', this.windowScrollHandler.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.windowScrollHandler.bind(this));
  }

  windowScrollHandler = throttle(() => {
    // todo: move this to summary
    const navbarH = this.refs.navbar.getMeasurements('height');
    const summaryRect = this.refs.summary.getMeasurements();
    const summaryHeight = summaryRect.height - navbarH;
    reportStore.showQuickSummary = summaryRect.top < (-summaryHeight);
  }, 200);

  render() {
    const { data } = this.props;
    const { stats, suites } = data.data;
    const { reportTitle } = data;
    return (
      <div>
        <DomNodeWrapper ref='navbar'>
          <Navbar reportTitle={ reportTitle } stats={ stats } />
        </DomNodeWrapper>
        <DomNodeWrapper ref='summary'>
          <Summary stats={ stats } />
        </DomNodeWrapper>
        <StatusBar stats={ stats } />
        <div className={ cx('details', 'container', { qs: reportStore.showQuickSummary }) }>
          <SuiteList suites={ suites.suites } />
        </div>
        <Footer />
        <NavMenu suites={ suites } />
        <DevTools position={ { bottom: 0, right: 20 } } />
      </div>
    );
  }
}

export default MochawesomeReport;
