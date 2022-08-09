import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import filmCardView from '../view/film-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';

export default class FilmsPresenter {
  filmsComponent = new FilmsView();

  filmsListComponent = new FilmsListView(
    '',
    '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>'
  );

  filmsListContainerComponent = new FilmsListContainerView();

  filmsListTopRatedComponent = new FilmsListView(
    'films-list--extra',
    '<h2 class="films-list__title">Top rated</h2>'
  );

  filmsListTopRatedContainerComponent = new FilmsListContainerView();

  filmsListMostCommentedComponent = new FilmsListView(
    'films-list--extra',
    '<h2 class="films-list__title">Most commented</h2>'
  );

  filmsListContainerMostCommentedComponent = new FilmsListContainerView();

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    render(
      new NavigationView(),
      this.filmsContainer,
      RenderPosition.BEFOREBEGIN
    );
    render(new SortView(), this.filmsContainer, RenderPosition.BEFOREBEGIN);

    render(this.filmsComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(
      this.filmsListContainerComponent,
      this.filmsListComponent.getElement()
    );

    for (let i = 0; i < 5; i++) {
      render(new filmCardView(), this.filmsListContainerComponent.getElement());
    }

    render(new LoadMoreButtonView(), this.filmsComponent.getElement());

    render(this.filmsListTopRatedComponent, this.filmsComponent.getElement());
    render(
      this.filmsListTopRatedContainerComponent,
      this.filmsListTopRatedComponent.getElement()
    );

    for (let i = 0; i < 2; i++) {
      render(
        new filmCardView(),
        this.filmsListTopRatedContainerComponent.getElement()
      );
    }

    render(
      this.filmsListMostCommentedComponent,
      this.filmsComponent.getElement()
    );
    render(
      this.filmsListContainerMostCommentedComponent,
      this.filmsListMostCommentedComponent.getElement()
    );

    for (let i = 0; i < 2; i++) {
      render(
        new filmCardView(),
        this.filmsListContainerMostCommentedComponent.getElement()
      );
    }
  };
}
