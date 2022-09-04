import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsEmptyListView from '../view/films-list-empty.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import { render, remove } from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import { updateItem } from '../utils/common.js';

const FILMS_COUNT_PER_STEP = 5;
export default class FilmsListPresenter {
  #title = null;
  #hiddenTitle = null;
  #extra = null;
  #container = null;
  #filmsListView = null;
  #filmsEmptyListView = null;
  #filmsListContainerView = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = null;
  #loadMoreButtonComponent = null;
  #filmPresenter = new Map();

  constructor({ title = '', hiddenTitle = false, extra, container }) {
    this.#container = container;
    this.#filmsEmptyListView = new FilmsEmptyListView();
    this.#filmsListView = new FilmsListView(
      title,
      hiddenTitle,
      extra
    );
  }

  filmsComponent = new FilmsView();

  filmsListContainerView = new FilmsListContainerView();

  prepearFilms = (films) => films;


  #renderedFilmCount = FILMS_COUNT_PER_STEP;

  init = (filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#films = this.prepearFilms([...this.#filmsModel.get()]);

    render(this.#filmsListView, this.#container.element);

    render(
      this.filmsListContainerView,
      this.#filmsListView.element
    );

    this.#renderAllFilms();
  };


  #renderAllFilms = () => {
    this.#films.slice(0, 5).forEach((film) => {
      this.#createFilm(film);
    });

    if( this.#films.length > this.#renderedFilmCount) {
      this.#loadMoreButtonComponent = new LoadMoreButtonView();
      render(this.#loadMoreButtonComponent, this.#filmsListView.element);
      this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    }
  };

  #createFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.filmsListContainerView.element, this.#handleCardChange, this.#handleResetDetail);
    filmPresenter.init(film, [...this.#commentsModel.get(film)]);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handleLoadMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((card) => this.#createFilm(card));

    this.#renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #handleCardChange = (updatedTask) => {
    this.#films = updateItem(this.#films, updatedTask);
    this.#filmPresenter.get(updatedTask.id).init(updatedTask, [...this.#commentsModel.get(updatedTask)]);
  };

  #handleResetDetail = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetDetailsView());
  };
}
