import FilmsView from '../view/films-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';

import FilmsListPresenter from './films-list-presenter';
import FilmsModel from '../model/films-model.js';
// import CommentsModel from '../model/comments-model.js';

export default class FilmsPresenter {
  constructor(cards, comments) {
    this.cards = cards;
    this.comments = comments;
  }

  filmsComponent = new FilmsView();

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    render(
      new NavigationView(),
      this.filmsContainer,
      RenderPosition.BEFOREBEGIN
    );

    render(new SortView(), this.filmsContainer, RenderPosition.BEFOREBEGIN);

    render(this.filmsComponent, this.filmsContainer);

    const filmsMainPresenter = new FilmsListPresenter({
      title: 'All movies. Upcoming',
      hiddenTitle: true,
      extra: false,
      container: this.filmsComponent,
    });
    const filmsModel = new FilmsModel();
    const filmsTopModel = new FilmsModel();
    const filmsCommentsModel = new FilmsModel();
    filmsMainPresenter.init(filmsModel);

    render(new LoadMoreButtonView(), this.filmsComponent.getElement());

    const filmsTopPresenter = new FilmsListPresenter({
      title: 'Top rated',
      hiddenTitle: false,
      extra: true,
      container: this.filmsComponent,
    });
    filmsTopPresenter.init(filmsTopModel);

    const filmsMostCommentedPresenter = new FilmsListPresenter({
      title: 'Most commented',
      hiddenTitle: false,
      extra: true,
      container: this.filmsComponent,
    });
    filmsMostCommentedPresenter.init(filmsCommentsModel);
  };
}
