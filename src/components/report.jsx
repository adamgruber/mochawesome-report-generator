import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import { Footer, Navbar, NavMenu, Summary, StatusBar } from './index';
import { SuiteList } from 'components/suite';
import 'styles/app.global.css';

@observer
class MochawesomeReport extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  state = {};

  render() {
    const { reportTitle, stats, suites } = this.props.data.data;
    return (
      <div>
        <Navbar reportTitle={ reportTitle } stats={ stats } />
        <Summary stats={ stats } />
        <StatusBar stats={ stats } />
        <div className='details container'>
          <SuiteList suites={ suites.suites } />
        </div>
        <Footer />
        <NavMenu suites={ suites } />
        <DevTools />
      </div>
    );
  }
}

export default MochawesomeReport;
