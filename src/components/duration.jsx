import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

class Duration extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    unitsClassName: PropTypes.string,
    timer: PropTypes.number,
    isSummary: PropTypes.bool
  }

  _getDurationObj = durationInMilliseconds => {
    const dur = moment.duration(durationInMilliseconds, 'ms');
    return {
      duration: dur,
      hrs: dur.get('h'),
      min: dur.get('m'),
      sec: dur.get('s'),
      ms: dur.get('ms')
    };
  }

  formatSummaryDuration = context => {
    const { hrs, min, sec, ms } = context;
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

  formatDuration = context => {
    const { hrs, min, sec, ms } = context;
    if (hrs < 1) {
      if (min < 1) {
        if (sec < 1) {
          return `${ms}ms`;
        }
        return `${sec}.${ms}s`;
      }
      return `${min}:${sec < 10 ? `0${sec}` : sec}.${ms}m`;
    }
    return `${hrs}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}.${ms}h`;
  }

  getSummaryDurationUnits = context => {
    const { hrs, min, sec } = context;
    if (hrs < 1) {
      if (min < 1) {
        if (sec < 1) {
          return 'MS';
        }
        return 'S';
      }
      return 'M';
    }
    return 'H';
  }

  render() {
    const { className, unitsClassName, timer, isSummary } = this.props;
    const duration = this._getDurationObj(timer);
    const summaryDuration = this.formatSummaryDuration(duration);
    const units = this.getSummaryDurationUnits(duration);

    if (isSummary) {
      return (
        <span>
          <span className={ classNames(className) }>{ summaryDuration }</span>
          <span className={ classNames(unitsClassName) }>{ units }</span>
        </span>
      );
    }

    return <span className={ classNames(className) }>{ this.formatDuration(duration) }</span>;
  }
}

export default Duration;
