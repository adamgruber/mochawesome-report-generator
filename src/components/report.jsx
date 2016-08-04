import React, { Component, PropTypes } from 'react';
import { Footer, Navbar, NavMenu, Summary, StatusBar, Suite } from './index';
import 'styles/app.global.css';

class MochawesomeReport extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  state = {};

  render() {
    const { reportTitle, stats, suites } = this.props.data;
    return (
      <div>
        <Navbar reportTitle={ reportTitle } stats={ stats } />
        <Summary stats={ stats } />
        <StatusBar stats={ stats } />
        <div className='details container'>
          { suites.suites.map((suite, i) => <Suite key={ i } suite={ suite } />) }
        </div>
        <Footer />
        <NavMenu suites={ suites } />
      </div>
    );
  }
}

export default MochawesomeReport;
