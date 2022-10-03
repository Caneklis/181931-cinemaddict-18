import { render, replace, remove, RenderPosition } from '../framework/render';
import { UpdateType, FilterType } from '../const.js';
import { filter } from '../utils/filter';

import NavigationView from '../view/navigation-view.js';

export default class FiltersPresenter {
  #container = null;
  #filmsModel = null;
  #filtersModel = null;
  #filterType = null;
  #navigationComponent = null;

  constructor(container, filmsModel, filtersModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.get();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    this.#filterType = this.#filtersModel.filter;
    this.#renderFilters();
  };

  #renderFilters = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#navigationComponent;

    this.#navigationComponent = new NavigationView(filters, this.#filtersModel.filter);
    this.#navigationComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#navigationComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#navigationComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
