import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import prettyMs from 'pretty-ms';

class Duration extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    timer: PropTypes.number,
  };

  formatDuration = ms =>
    prettyMs(ms, {
      unitCount: 3,
    });

  render() {
    const { className, timer } = this.props;

    return (
      <span className={classNames(className)}>
        {this.formatDuration(timer)}
      </span>
    );
  }
}

export default Duration;
