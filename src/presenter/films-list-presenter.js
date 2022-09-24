import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsEmptyListView from '../view/films-list-empty.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import { updateItem } from '../utils/common.js';

import { generateFilter } from '../mock/filter.js';

import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';

import {sortByDateDown, sortByRatingDown} from '../utils/sort.js';
import { SortType, FilterType, UserAction, UpdateType } from '../const.js';
import { filter } from '../utils/filter.js';

import filterModel from '../model/filter-model.js';

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
  #resetView = null;
  #filterModel = null;
  #filterType = FilterType.ALL;

  #sortComponent = new SortView();
  #currentSortType = SortType.DEFAULT;

  // #sortComponent = null;
  // #loadMoreButtonComponent = null;
  // #sourcedFilms = [];

  constructor({ title = '', hiddenTitle = false, extra, container }, resetView, filmsModel) {
    this.#container = container;
    this.#filmsEmptyListView = new FilmsEmptyListView();
    this.#filmsListView = new FilmsListView(
      title,
      hiddenTitle,
      extra
    );
    this.#resetView = resetView;
    this.#filmsModel = filmsModel;
    this.#filterModel = filmsModel;

    // this.#filmsModel.addObserver(this.#handleModelEvent);
    // this.#filterModel.addObserver(this.#handleModelEvent);
  }

  filmsComponent = new FilmsView();

  filmsListContainerView = new FilmsListContainerView();

  prepearFilms = (films) => films;

  #renderedFilmCount = FILMS_COUNT_PER_STEP;

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
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
        this.#filmsModel.update(updateType, update.movie);
        this.#commentsModel.add(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.update(updateType, update.movie);
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
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsList();
        break;
    }
  };


  init = (filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#films = this.prepearFilms([...this.#filmsModel.get()]);

    // this.#sourcedFilms = [...this.#films];

    if (this.#films.length > 2) {
      this.#renderNavigation(this.#filmsModel);
      this.#renderSort();
    }

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
    const filmPresenter = new FilmPresenter(this.filmsListContainerView.element, this.#handleCardChange, this.#resetView);
    filmPresenter.init(film, [...this.#commentsModel.get(film)]);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handleLoadMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((card) => this.#createFilm(card));

    this.#renderedFilmCount += FILMS_COUNT_PER_STEP;
  };

  #renderNavigation = (filmsModel) => {
    const filters = generateFilter(filmsModel.get());

    render(new NavigationView(filters),
      this.#container.element,
      RenderPosition.BEFOREBEGIN);
  };

  // #sortFilms = (sortType) => {
  //   switch (sortType) {
  //     case SortType.DATE_UP:
  //       this.#films.sort(sortByDateDown);
  //       break;
  //     case SortType.RATING:
  //       this.#films.sort(sortByRatingDown);
  //       break;
  //     default:
  //       this.#films = [...this.#sourcedFilms];
  //   }

  //   this.#currentSortType = sortType;
  // };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    // this.#sortFilms(sortType);
    this.#currentSortType = sortType;
    this.#clearFilmsList();
  };

  #renderSort = ()=> {
    render(this.#sortComponent, this.#container.element, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    remove(this.#loadMoreButtonComponent);
    this.#renderAllFilms();
  };

  #handleCardChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    // this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, [...this.#commentsModel.get(updatedFilm)]);
  };

  handleResetDetail = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetDetailsView());
  };
}
