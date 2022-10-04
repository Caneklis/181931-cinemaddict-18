import FilmsListView from '../view/films-list-view.js';
import FilmsEmptyListView from '../view/films-list-empty.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import SortView from '../view/sort-view.js';
import {sortByDateDown, sortByRatingDown} from '../utils/sort.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';

const FILMS_COUNT_PER_STEP = 5;
export default class FilmsListPresenter {
  #container = null;

  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmsListView = null;
  #filmsEmptyListView = null;
  #loadMoreButtonView = null;
  #resetView = null;
  #sortView = null;
  #navigationView = null;

  #filmPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  #renderedFilmCount = FILMS_COUNT_PER_STEP;

  #openPopup = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;

  constructor({extra, container, title = '', hiddenTitle = false, resetView, filmsModel = null, filterModel = null, commentsModel = null}) {
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
    this.#commentsModel = commentsModel;

    this.#filmsModel?.addObserver(this.#handleModelEvent);
    this.#filterModel?.addObserver(this.#handleModelEvent);
    this.#commentsModel?.addObserver(this.#handleModelEvent);
  }

  filmsListContainerView = new FilmsListContainerView();

  prepareFilms = (films) => films;

  get films() {
    const filterType = this.#filterModel.filter;
    const films = [...this.#filmsModel.get()];
    // console.log(films);
    const filteredFilms = this.prepareFilms(filter[filterType](films));

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
        this.#filmsModel.update(updateType, update.id);
        this.#commentsModel.add(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.delete(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.id).init(data, this.#commentsModel.get(data));
        break;
      case UpdateType.MINOR:
        this.#clearFilmsList();
        this.#renderAllFilms();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsList({resetRenderedTaskCount: true});
        this.#renderAllFilms();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderAllFilms();
        break;
    }
  };

  init = (filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    render(this.#filmsListView, this.#container.element);

    render(
      this.filmsListContainerView,
      this.#filmsListView.element
    );

    this.#renderAllFilms();
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container.element, RenderPosition.BEFOREEND);
  };

  #renderAllFilms = () => {
    const films = this.films;

    films.slice(0, this.#renderedFilmCount).forEach((film) => {
      this.#createFilm(film);
    });

    this.#renderedFilmCount = FILMS_COUNT_PER_STEP;


    if (films.length > 2) {
      this.#renderSort();
    }

    if (films.length > this.#renderedFilmCount) {
      this.#loadMoreButtonView = new LoadMoreButtonView();
      render(this.#loadMoreButtonView, this.#filmsListView.element);
      this.#loadMoreButtonView.setClickHandler(this.#handleLoadMoreButtonClick);
    }
  };

  #createFilm = (film) => {
    let filmPresenters;

    if (this.#openPopup && film.id === this.#openPopup.id) {
      filmPresenters = this.#openPopup.presenter;
    } else {
      filmPresenters = new FilmPresenter(
        this.filmsListContainerView.element,
        this.#handleViewAction,
        this.#resetView,
        this.#commentsModel
      );
    }

    filmPresenters.init(film, [...this.#commentsModel.get(film)]);
    this.#filmPresenters.set(film.id, filmPresenters);
  };

  #clearFilmsList = ({resetRenderedTaskCount = false, resetSortType = false} = {}) => {
    this.#filmPresenters.forEach((presenter, id) => {
      if (presenter.isPopupOpen) {
        this.#openPopup = {presenter, id};
      } else {
        presenter.destroy();
      }
    });

    this.#filmPresenters.clear();

    remove(this.#sortView);
    remove(this.#loadMoreButtonView);
    remove(this.#navigationView);

    if (resetRenderedTaskCount) {
      this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #handleLoadMoreButtonClick = () => {
    const taskCount = this.films.length;
    const newRenderedTaskCount = Math.min(taskCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP);
    const tasks = this.films.slice(this.#renderedFilmCount, newRenderedTaskCount);

    tasks.forEach((card) => this.#createFilm(card));
    this.#renderedFilmCount = newRenderedTaskCount;

    if (this.#renderedFilmCount >= taskCount) {
      remove(this.#loadMoreButtonView);
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

  #renderSort = () => {
    this.#sortView = new SortView(this.#currentSortType);
    this.#sortView.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortView, this.#container.element, RenderPosition.BEFOREBEGIN);
  };

  handleResetDetail = () => {
    this.#openPopup = null;
    this.#filmPresenters.forEach((presenter) => presenter.resetDetailsView());
  };
}
