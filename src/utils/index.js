import moment from 'moment';

const _getDurationObj = (durationInMilliseconds) => {
  const dur = moment.duration(durationInMilliseconds, 'ms');
  return {
    duration: dur,
    hrs: dur.get('h'),
    min: dur.get('m'),
    sec: dur.get('s'),
    ms: dur.get('ms')
  };
};

const formatSummaryDuration = (context) => {
  const { hrs, min, sec, ms } = _getDurationObj(context);
  if (hrs < 1) {
    if (min < 1) {
      if (sec < 1) {
        return context;
      }
      return `${sec}.${ms}`;
    }
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  }
  return `${hrs}:${min < 10 ? `0${min}` : min}`;
};

const getSummaryDurationUnits = (context) => {
  const { hrs, min, sec } = _getDurationObj(context);
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
};

export {
  formatSummaryDuration,
  getSummaryDurationUnits
};
