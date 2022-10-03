import { render, RenderPosition } from '../framework/render';
import { UpdateType, FilterType } from '../const.js';
import { filter } from '../utils/filter';

import NavigationView from '../view/navigation-view.js';

export default class FiltersPresenter {
  #container = null;
  #filmsModel = null;
  #filtersModel = null;
  #filterType = null;
  #navigationComponent = null;
  #quantity = {};

  constructor(container, filmsModel, filtersModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#filterType = this.#filtersModel.filter;
    this.#renderFilters();
  };

  #renderFilters = () => {
    this.#quantity = {
      [FilterType.WATCHLIST]: filter[FilterType.WATCHLIST](this.#filmsModel.films).length,
      [FilterType.HISTORY]: filter[FilterType.HISTORY](this.#filmsModel.films).length,
      [FilterType.FAVORITES]: filter[FilterType.FAVORITES](this.#filmsModel.films).length,
    };

    if(!this.#navigationComponent) {
      this.#navigationComponent = new NavigationView(this.#filterType, this.#quantity);
      this.#navigationComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
      render(this.#navigationComponent, document.querySelector('body'), RenderPosition.AFTERBEGIN);
      return;
    }
    this.#navigationComponent.updateElement({filter: this.#filterType, count: this.#quantity});
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR ,filterType);
  };
}
