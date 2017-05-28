/* eslint-disable import/no-extraneous-dependencies, no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DevTools from 'mobx-react-devtools';
import { observer } from 'mobx-react';
import { Footer, Navbar } from 'components';
import { NavMenu } from 'components/nav-menu';
import { Suite } from 'components/suite';
import cx from 'classnames';
import 'styles/app.global.css';

@observer
class MochawesomeReport extends Component {
  static displayName = 'MochawesomeReport';
  static propTypes = {
    store: PropTypes.object
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
    setTimeout(() => {
      const w = this.qsNode.getBoundingClientRect().width;
      this.props.store.setQuickSummaryWidth(w);
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  resizeHandler = () => {
    this.props.store.setWindowWidth(window.innerWidth);
  }

  render() {
    const { reportTitle, suites, allSuites, stats, enableChart, enableCode,
      showPassed, showFailed, showPending, showSkipped, showHooks, sideNavOpen,
      mobileBreakpoint, quickSummaryWidth, devMode } = this.props.store;

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
      <div>
        <Navbar
          reportTitle={ reportTitle }
          stats={ stats }
          qsWidth={ quickSummaryWidth }
          mobileBreakpoint={ mobileBreakpoint }
          qsNodeRef={ node => (this.qsNode = node) } />
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
    );
  }
}

export default MochawesomeReport;
