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
          showPending,
          showSkipped,
          showHooks,
        } = this.props.reportStore;
        return {
          showPassed,
          showFailed,
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
      <ul id="details" className={cx('details', 'container', 'list-unstyled')}>
        {suites.map(suite => (
          <Suite
            key={suite.uuid}
            suite={suite}
            enableChart={enableChart}
            enableCode={enableCode}
          />
        ))}
      </ul>
    );
  }
}

export default ReportBody;
