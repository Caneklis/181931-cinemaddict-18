import FilmsView from '../view/films-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import FilmsListRatedPresenter from './films-list-rated-presenter.js';
import FilmsListAllPresenter from './films-list-all-presenter.js';
import FilmsListMostCommentedPresenter from './films-list-most-commented-presenter.js';
import FilmsEmptyListPresenter from './films-empty-presenter.js';

export default class FilmsPresenter {
  #container = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;
  #films = null;
  #sortComponent = new SortView();

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
  }

  #filmView = new FilmsView();

  filmsListPresenters = new Map();

  prepearFilms = (films) => films;

  init = () => {

    const films = this.prepearFilms([...this.#filmsModel.get()]);

    render(this.#filmView, this.#container);
    if (films.length > 0) {

      const filmsMainPresenter = new FilmsListAllPresenter({
        container: this.#filmView,
      }, this.#handleResetDetail);
      this.filmsListPresenters.set('main-presenter', filmsMainPresenter);

      filmsMainPresenter.init(this.#filmsModel, this.#commentsModel, this.#filterModel);

      const filmsTopPresenter = new FilmsListRatedPresenter({
        container: this.#filmView,
      }, this.#handleResetDetail);
      this.filmsListPresenters.set('top-presenter', filmsTopPresenter);
      filmsTopPresenter.init(this.#filmsModel, this.#commentsModel, this.#filterModel);

      const filmsMostCommentedPresenter = new FilmsListMostCommentedPresenter({
        container: this.#filmView,
      }, this.#handleResetDetail);
      this.filmsListPresenters.set('most-view-presenter', filmsMostCommentedPresenter);
      filmsMostCommentedPresenter.init(this.#filmsModel, this.#commentsModel, this.#filterModel);
    } else {
      const filmsEmptyPresenter = new FilmsEmptyListPresenter({
        container: this.#filmView,
      });

      filmsEmptyPresenter.init(this.#filmsModel, this.#commentsModel, this.#filterModel);
    }
  };

  #handleResetDetail = () => {
    this.filmsListPresenters.forEach((presenter) => presenter.handleResetDetail());
  };

}
