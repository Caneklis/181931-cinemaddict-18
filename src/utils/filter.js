import { FilterType } from '../const.js';

const isWatchList = (film) => film.userDetails.watchlist;
const isFavorite = (film) => film.userDetails.favorite;
const isHistory = (film) => film.userDetails.alreadyWatched;

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter(isWatchList),
  [FilterType.HISTORY]: (films) => films.filter(isHistory),
  [FilterType.FAVORITES]: (films) => films.filter(isFavorite),
};

export { filter };
