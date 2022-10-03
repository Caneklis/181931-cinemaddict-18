const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites'
};


const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist === true),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched === true),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite === true),
};

export { filter, FilterType };
