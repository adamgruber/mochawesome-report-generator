import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Duration extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    unitsClassName: PropTypes.string,
    timer: PropTypes.number,
    isSummary: PropTypes.bool,
  };

  _getDurationObj = durationInMs => {
    const DAY = 24 * 60 * 60 * 1000;
    const HOUR = 60 * 60 * 1000;
    const MINUTE = 60 * 1000;
    const SECOND = 1000;

    const days = Math.floor(durationInMs / DAY);
    const daysms = durationInMs % DAY;
    const hrs = Math.floor(daysms / HOUR);
    const hrsms = durationInMs % HOUR;
    const min = Math.floor(hrsms / MINUTE);
    const minms = durationInMs % MINUTE;
    const sec = Math.floor(minms / SECOND);
    const ms = durationInMs % SECOND;

    return { days, hrs, min, sec, ms };
  };

  formatSummaryDuration = context => {
    const { days, hrs, min, sec, ms } = context;
    if (days < 1) {
      if (hrs < 1) {
        if (min < 1) {
          if (sec < 1) {
            return ms;
          }
          return `${sec}.${ms}`;
        }
        return `${min}:${sec < 10 ? `0${sec}` : sec}`;
      }
      return `${hrs}:${min < 10 ? `0${min}` : min}`;
    }
    return `${days}d ${hrs}:${min < 10 ? `0${min}` : min}`;
  };

  formatDuration = context => {
    const { days, hrs, min, sec, ms } = context;
    if (days < 1) {
      if (hrs < 1) {
        if (min < 1) {
          if (sec < 1) {
            return `${ms}ms`;
          }
          return `${sec}.${ms}s`;
        }
        return `${min}:${sec < 10 ? `0${sec}` : sec}.${ms}m`;
      }
      return `${hrs}:${min < 10 ? `0${min}` : min}:${
        sec < 10 ? `0${sec}` : sec
      }.${ms}h`;
    }
    return `${days}d ${hrs}:${min < 10 ? `0${min}` : min}:${
      sec < 10 ? `0${sec}` : sec
    }.${ms}h`;
  };

  getSummaryDurationUnits = context => {
    const { hrs, min, sec } = context;
    if (hrs < 1) {
      if (min < 1) {
        if (sec < 1) {
          return 'ms';
        }
        return 's';
      }
      return 'm';
    }
    return 'h';
  };

  render() {
    const { className, unitsClassName, timer, isSummary } = this.props;
    const duration = this._getDurationObj(timer);
    const summaryDuration = this.formatSummaryDuration(duration);
    const units = this.getSummaryDurationUnits(duration);

    if (isSummary) {
      return (
        <span>
          <span className={classNames(className)}>{summaryDuration}</span>
          <span className={classNames(unitsClassName)}>{units}</span>
        </span>
      );
    }

    return (
      <span className={classNames(className)}>
        {this.formatDuration(duration)}
      </span>
    );
  }
}

export default Duration;
