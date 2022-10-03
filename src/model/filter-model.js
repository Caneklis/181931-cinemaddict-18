import Observable from '../framework/observable.js';
import { FilterType } from '../utils/filter.js';

export default class filterModel extends Observable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
