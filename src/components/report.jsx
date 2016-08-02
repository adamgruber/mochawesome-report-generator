import React, { Component, PropTypes } from 'react';
import { Navbar, Summary } from './index';
import 'styles/app.global.css';

class MochawesomeReport extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  state = {};

  render() {
    const { reportTitle, stats } = this.props.data;
    return (
      <div>
        <Navbar reportTitle={ reportTitle } stats={ stats } />
        <Summary stats={ stats } />
        { /* <StatusBar /> */ }
      </div>
    );
  }
}

export default MochawesomeReport;
