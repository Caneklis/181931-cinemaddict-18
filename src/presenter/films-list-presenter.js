import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import { render } from '../render.js';
import FilmPresenter from './film-presenter.js';

export default class FilmsListPresenter {
  title;
  hiddenTitle;
  extra;

  constructor({ title = '', hiddenTitle = false, extra, container }) {
    this.container = container;

    this.filmsListView = new FilmsListView(
      title,
      hiddenTitle,
      extra
    );
  }

  filmsComponent = new FilmsView();

  filmsListContainerView = new FilmsListContainerView();

  prepearFilms = (films) => films;

  init = (filmsModel, commentsModel) => {
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;
    this.cards = this.prepearFilms([...this.filmsModel.getFilms()]);

    render(this.filmsListView, this.container.getElement());
    render(
      this.filmsListContainerView,
      this.filmsListView.getElement()
    );

    this.cards.forEach((film) => {
      this.createFilm(film);
    });
  };

  createFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.filmsListContainerView.getElement());
    filmPresenter.init(film, this.commentsModel.getCommentsForFilm(film.id));
  };
}
