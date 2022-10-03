import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsEmptyListView from '../view/films-list-empty.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import SortView from '../view/sort-view.js';
import {sortByDateDown, sortByRatingDown} from '../utils/sort.js';
import { SortType, UserAction, UpdateType } from '../const.js';
import {filter, FilterType } from '../utils/filter.js';

const FILMS_COUNT_PER_STEP = 5;
export default class FilmsListPresenter {
  #container = null;
  #filmsListView = null;
  #filmsEmptyListView = null;
  #filmsModel = null;
  #commentsModel = null;
  #loadMoreButtonComponent = null;
  #filmPresenter = new Map();
  #resetView = null;
  #filterModel = null;
  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;
  #navigationComponent = null;
  #renderedFilmCount = 0;
  #openPopup = null;

  constructor({ extra, container, title = '', hiddenTitle = false, resetView, filmsModel = null, filterModel = null }) {
    this.#container = container;
    this.#filmsEmptyListView = new FilmsEmptyListView();
    this.#filmsListView = new FilmsListView(
      title,
      hiddenTitle,
      extra
    );
    this.#resetView = resetView;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel?.addObserver(this.#handleModelEvent);
    this.#filterModel?.addObserver(this.#handleModelEvent);
  }

  filmsListContainerView = new FilmsListContainerView();

  prepearFilms = (films) => films;

  get films() {
    const filterType = this.#filterModel.filter;
    const films = [...this.#filmsModel.get()];
    const filteredFilms = this.prepearFilms(filter[filterType](films));

    switch (this.#currentSortType) {
      case SortType.DATE_DOWN:
        return [...filteredFilms].sort(sortByDateDown);
      case SortType.RATING:
        return [...filteredFilms].sort(sortByRatingDown);
      default:
        return filteredFilms;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.update(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.update(updateType, update.film);
        this.#commentsModel.add(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.update(updateType, update.film);
        this.#commentsModel.delete(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data, this.#commentsModel.getComments(data.id));
        break;
      case UpdateType.MINOR:
        this.#clearFilmsList();
        this.#renderAllFilms();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsList({resetRenderedTaskCount: true});
        this.#renderAllFilms();
        break;
    }
  };


  init = (filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    render(this.#filmsListView, this.#container.element);

    render(
      this.filmsListContainerView,
      this.#filmsListView.element
    );

    this.#renderAllFilms();
  };

  #renderAllFilms = () => {
    const films = this.films;

    films.slice(0, this.#renderedFilmCount + FILMS_COUNT_PER_STEP).forEach((film) => {
      this.#createFilm(film);
    });

    this.#renderedFilmCount = FILMS_COUNT_PER_STEP;


    if ( films.length > 2) {
      this.#renderSort();
    }

    if( films.length > this.#renderedFilmCount) {
      this.#loadMoreButtonComponent = new LoadMoreButtonView();
      render(this.#loadMoreButtonComponent, this.#filmsListView.element);
      this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #createFilm = (film) => {
    let filmPresenter;

    if (this.#openPopup && film.id === this.#openPopup.id) {
      filmPresenter = this.#openPopup.presenter;
    } else {
      filmPresenter = new FilmPresenter(
        this.filmsListContainerView.element,
        this.#handleViewAction,
        this.#resetView,
        this.#handleModelEvent );
    }

    filmPresenter.init(film, [...this.#commentsModel.get(film)]);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #clearFilmsList = ({resetRenderedTaskCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter, id) => {
      if (presenter.isPopupOpen) {
        this.#openPopup = {presenter, id};
      } else {
        presenter.destroy();
      }
    });

    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    // remove(this.#noTaskComponent);
    remove(this.#loadMoreButtonComponent);
    remove(this.#navigationComponent);

    if (resetRenderedTaskCount) {
      this.#renderedFilmCount = 0;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #handleLoadMoreButtonClick = () => {
    const taskCount = this.films.length;
    const newRenderedTaskCount = Math.min(taskCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP);
    console.log(taskCount, this.#renderedFilmCount, newRenderedTaskCount);
    const tasks = this.films.slice(this.#renderedFilmCount, newRenderedTaskCount);

    tasks.forEach((card) => this.#createFilm(card));
    this.#renderedFilmCount = newRenderedTaskCount;

    if (this.#renderedFilmCount >= taskCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsList({resetRenderedTaskCount: true});
    this.#renderAllFilms();
  };

  #renderSort = ()=> {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#container.element, RenderPosition.BEFOREBEGIN);
  };

  handleResetDetail = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetDetailsView());
  };
}
