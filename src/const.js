const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites'
};

const filterTypeToText = {
  [FilterType.ALL]: 'All movies',
  [FilterType.WATCHLIST]: 'Watchlist',
  [FilterType.HISTORY]: 'History',
  [FilterType.FAVORITES]: 'Favorites'
};

const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATING: 'raiting',
};

export {FilterType, filterTypeToText, SortType};
