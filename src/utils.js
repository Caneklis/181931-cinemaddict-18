import dayjs from 'dayjs';
import duration from 'dayjs/esm/plugin/duration';

dayjs.extend(duration);

const ESCAPE_KEY_NAME = 'Escape';

const isEscapeKey = (evt) => evt.key === ESCAPE_KEY_NAME;

const formatDate = (date, format) => dayjs(date).format(format);

const formatDuration = (time) =>
  dayjs.duration(time, 'minutes').format('H[h] mm[m]');

const toggleFilmsControlClass = (toggle, activeClass) =>
  toggle ? activeClass : '';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export {
  formatDate,
  formatDuration,
  toggleFilmsControlClass,
  getRandomInteger,
  isEscapeKey
};
