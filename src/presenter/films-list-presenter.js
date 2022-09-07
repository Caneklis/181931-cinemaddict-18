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
import { SortType } from '../const.js';

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

  #sortComponent = new SortView();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

  constructor({ title = '', hiddenTitle = false, extra, container }, resetView) {
    this.#container = container;
    this.#filmsEmptyListView = new FilmsEmptyListView();
    this.#filmsListView = new FilmsListView(
      title,
      hiddenTitle,
      extra
    );
    this.#resetView = resetView;
  }

  filmsComponent = new FilmsView();

  filmsListContainerView = new FilmsListContainerView();

  prepearFilms = (films) => films;

  #renderedFilmCount = FILMS_COUNT_PER_STEP;

  init = (filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#films = this.prepearFilms([...this.#filmsModel.get()]);

    this.#sourcedFilms = [...this.#films];

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

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #renderNavigation = (filmsModel) => {
    const filters = generateFilter(filmsModel.get());

    render(new NavigationView(filters),
      this.#container.element,
      RenderPosition.BEFOREBEGIN);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE_UP:
        this.#films.sort(sortByDateDown);
        break;
      case SortType.RATING:
        this.#films.sort(sortByRatingDown);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
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
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, [...this.#commentsModel.get(updatedFilm)]);
  };

  handleResetDetail = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetDetailsView());
  };
}
