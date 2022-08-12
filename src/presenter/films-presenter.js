import FilmsView from '../view/films-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';

import FilmsListPresenter from './films-list-presenter';
import FilmsModel from '../model/films-model.js';
import FilmsListRatedPresenter from './films-list-rated-presenter.js';
import FilmsListAllPresenter from './films-list-all-presenter.js';
import FilmsListMostCommentedPresenter from './films-list-most-commented-presenter.js';
// import CommentsModel from '../model/comments-model.js';

export default class FilmsPresenter {
  constructor(container, filmsModel, commentsModel) {
    this.container = container;
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;
  }

  filmView = new FilmsView();

  init = () => {

    render(
      new NavigationView(),
      this.container,
      RenderPosition.BEFOREBEGIN
    );

    render(new SortView(), this.container, RenderPosition.BEFOREBEGIN);

    render(this.filmView, this.container);

    const filmsMainPresenter = new FilmsListAllPresenter({
      container: this.filmView,
    });

    filmsMainPresenter.init(this.filmsModel, this.commentsModel);

    render(new LoadMoreButtonView(), this.filmView.getElement());

    const filmsTopPresenter = new FilmsListRatedPresenter({
      container: this.filmView,
    });
    filmsTopPresenter.init(this.filmsModel, this.commentsModel);

    const filmsMostCommentedPresenter = new FilmsListMostCommentedPresenter({
      container: this.filmView,
    });
    filmsMostCommentedPresenter.init(this.filmsModel, this.commentsModel);
  };
}
