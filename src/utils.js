import dayjs from 'dayjs';
import duration from 'dayjs/esm/plugin/duration';

dayjs.extend(duration);

const formatDate = (date, format) => dayjs(date).format(format);

const formatDuration = (time) =>
  dayjs.duration(time, 'minutes').format('H[h] mm[m]');

const toggleFilmsControlClass = (toggle, activeClass) =>
  toggle ? activeClass : '';


export {
  formatDate,
  formatDuration,
  toggleFilmsControlClass,
};
