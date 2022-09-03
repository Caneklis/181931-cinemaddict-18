// import {filter} from '../utils/filter.js';

// export const generateFilter = (tasks) => Object.entries(filter).map(
//   ([filterName, filterTasks]) => ({
//     name: filterName,
//     count: filterTasks(tasks).length,
//   }),
// );
import { filter } from '../utils/filter.js';
import { filterTypeToText } from '../const.js';

export const generateFilter = (movies) => Object.entries(filter).map(
  ([filterName, filterMovies]) => ({
    name: filterName,
    text: filterTypeToText[filterName],
    count: filterMovies(movies).length,
  }),
);
