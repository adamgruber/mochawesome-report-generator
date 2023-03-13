import React from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Suite } from 'components/suite';
import cx from 'classnames';

@inject('reportStore')
@observer
class ReportBody extends React.Component {
  static propTypes = {
    reportStore: PropTypes.object,
  };

  componentDidMount() {
    this.updateSuites();
    this.disposer = reaction(
      () => {
        const {
          showPassed,
          showFailed,
          showFlaky,
          showPending,
          showSkipped,
          showHooks,
        } = this.props.reportStore;
        return {
          showPassed,
          showFailed,
          showFlaky,
          showPending,
          showSkipped,
          showHooks,
        };
      },
      () => this.updateSuites(0),
      { delay: 300 }
    );
  }

  componentWillUnmount() {
    this.disposer();
  }

  updateSuites(timeout) {
    this.props.reportStore.updateFilteredSuites(timeout);
  }

  render() {
    const {
      enableCode,
      enableChart,
      filteredSuites: suites,
    } = this.props.reportStore;

    return (
      <div id="details" className={cx('details', 'container')}>
        {suites.map(suite => (
          <Suite
            key={suite.uuid}
            suite={suite}
            enableChart={enableChart}
            enableCode={enableCode}
          />
        ))}
      </div>
    );
  }
}

export default ReportBody;
