import FilmsView from '../view/films-view.js';
import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../framework/render.js';
import FilmsListRatedPresenter from './films-list-rated-presenter.js';
import FilmsListAllPresenter from './films-list-all-presenter.js';
import FilmsListMostCommentedPresenter from './films-list-most-commented-presenter.js';
import FilmsEmptyListPresenter from './films-empty-presenter.js';
import { generateFilter } from '../mock/filter.js';

export default class FilmsPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = null;

  constructor(container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  #filmView = new FilmsView();

  filmsListPresenters = new Map();

  prepearFilms = (films) => films;

  init = () => {

    const films = this.prepearFilms([...this.#filmsModel.get()]);

    render(this.#filmView, this.#container);
    if (films.length > 0) {

      this.#renderNavigation();
      this.#renderSort();

      const filmsMainPresenter = new FilmsListAllPresenter({
        container: this.#filmView,
      }, this.#handleResetDetail);
      this.filmsListPresenters.set('main-presenter', filmsMainPresenter);

      filmsMainPresenter.init(this.#filmsModel, this.#commentsModel);

      const filmsTopPresenter = new FilmsListRatedPresenter({
        container: this.#filmView,
      }, this.#handleResetDetail);
      this.filmsListPresenters.set('top-presenter', filmsTopPresenter);
      filmsTopPresenter.init(this.#filmsModel, this.#commentsModel);

      const filmsMostCommentedPresenter = new FilmsListMostCommentedPresenter({
        container: this.#filmView,
      }, this.#handleResetDetail);
      this.filmsListPresenters.set('most-view-presenter', filmsMostCommentedPresenter);
      filmsMostCommentedPresenter.init(this.#filmsModel, this.#commentsModel);
    } else {
      const filmsEmptyPresenter = new FilmsEmptyListPresenter({
        container: this.#filmView,
      });

      filmsEmptyPresenter.init(this.#filmsModel, this.#commentsModel);
    }
  };

  #renderNavigation = () => {

    const filters = generateFilter(this.#filmsModel.get());

    render(new NavigationView(filters),
      this.#container,
      RenderPosition.BEFOREBEGIN);
  };

  #renderSort = ()=> {
    render(new SortView(), this.#container, RenderPosition.BEFOREBEGIN);
  };

  #handleResetDetail = () => {
    this.filmsListPresenters.forEach((presenter) => presenter.handleResetDetail());
  };

}
