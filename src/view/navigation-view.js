import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (`
<a href="#${type}" data-type="${type}" class="main-navigation__item
${ type === currentFilterType ? ' main-navigation__item--active' : ''}">
${name}
 <span class="main-navigation__item-count">${count}</span></a>`);};

const createNavigationTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0, currentFilterType))
    .join('');
  return `<nav class="main-navigation">
  ${filterItemsTemplate}
  </nav>`;

};

export default class NavigationView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.dataset.type) {
      this._callback.filterTypeChange(evt.target.dataset.type);
    }
  };
}
