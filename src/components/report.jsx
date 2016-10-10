import React, { Component, PropTypes } from 'react';
import DevTools from 'mobx-react-devtools';
import { observer } from 'mobx-react';
import reportStore from '../js/reportStore';
import { Footer, Navbar, NavMenu } from './index';
import { Suite } from 'components/suite';
import cx from 'classnames';
import 'styles/app.global.css';

@observer
class MochawesomeReport extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  state = {};

  render() {
    const { data } = this.props;
    const { stats } = data.data;
    const { reportTitle } = data;
    return (
      <div>
        <Navbar reportTitle={ reportTitle } stats={ stats } />
        <div id='details' className={ cx('details', 'container') }>
          { reportStore.suites.map(suite => (
            <Suite key={ suite.uuid } suite={ suite } />)) }
        </div>
        <Footer />
        <NavMenu reportTitle={ reportTitle } stats={ stats } suites={ reportStore.allSuites } />
        <DevTools position={ { bottom: 0, right: 20 } } />
      </div>
    );
  }
}

export default MochawesomeReport;
