import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import filmCardView from '../view/film-card-view.js';
import { render } from '../render.js';

export default class FilmsListPresenter {
  title;
  hiddenTitle;
  extra;

  constructor({ title = '', hiddenTitle = false, extra, container }) {
    this.container = container;

    this.filmsListTopRatedComponent = new FilmsListView(
      title,
      hiddenTitle,
      extra
    );
  }

  filmsComponent = new FilmsView();

  filmsListTopRatedContainerComponent = new FilmsListContainerView();

  init = (filmsModel) => {
    this.filmsModel = filmsModel;
    this.cards = [...this.filmsModel.getFilms()];

    render(this.filmsListTopRatedComponent, this.container.getElement());
    render(
      this.filmsListTopRatedContainerComponent,
      this.filmsListTopRatedComponent.getElement()
    );

    for (let i = 0; i < this.cards.length; i++) {
      render(
        new filmCardView(this.cards[i]),
        this.filmsListTopRatedContainerComponent.getElement()
      );
    }
  };
}
