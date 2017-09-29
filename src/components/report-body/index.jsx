import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Suite } from 'components/suite';
import cx from 'classnames';
import Loader from './loader';

@inject('reportStore') @observer
class ReportBody extends React.Component {
  static propTypes = {
    reportStore: PropTypes.object
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.reportStore.toggleIsLoading();
    }, this.props.reportStore.initialLoadTimeout);
  }

  render() {
    const {
      enableCode,
      isLoading,
      suites
    } = this.props.reportStore;

    return (
      <div id='details' className={ cx('details', 'container') }>
        { isLoading
          ? <Loader />
          : suites.map(suite => (
            <Suite
              key={ suite.uuid }
              suite={ suite }
              enableCode={ enableCode } />)
            )
        }
      </div>
    );
  }
}

export default ReportBody;
