import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import { render } from '../render.js';
import FilmPresenter from './film-presenter.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';

const TASK_COUNT_PER_STEP = 5;
export default class FilmsListPresenter {
  #title = null;
  #hiddenTitle = null;
  #extra = null;
  #container = null;
  #filmsListView = null;
  #filmsListContainerView = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = null;

  constructor({ title = '', hiddenTitle = false, extra, container }) {
    this.#container = container;

    this.#filmsListView = new FilmsListView(
      title,
      hiddenTitle,
      extra
    );
  }

  filmsComponent = new FilmsView();

  filmsListContainerView = new FilmsListContainerView();

  prepearFilms = (films) => films;


  #renderedFilmCount = TASK_COUNT_PER_STEP;

  #loadMoreButtonComponent = new LoadMoreButtonView();

  init = (filmsModel, commentsModel) => {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#films = this.prepearFilms([...this.#filmsModel.get()]);

    render(this.#filmsListView, this.#container.element);

    render(
      this.filmsListContainerView,
      this.#filmsListView.element
    );

    this.#films.slice(0, 5).forEach((film) => {
      this.#createFilm(film);
    });

    if( this.#films.length > this.#renderedFilmCount) {
      render(this.#loadMoreButtonComponent, this.#filmsListView.element);
    }


    this.#loadMoreButtonComponent.element.addEventListener('click',
      this.#handleLoadMoreButtonClick);

  };

  #createFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.filmsListContainerView.element);
    filmPresenter.init(film, [...this.#commentsModel.get(film)]);
  };

  #handleLoadMoreButtonClick = (e) => {
    e.preventDefault();
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + TASK_COUNT_PER_STEP)
      .forEach((card) => this.#createFilm(card));

    this.#renderedFilmCount += TASK_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };
}
