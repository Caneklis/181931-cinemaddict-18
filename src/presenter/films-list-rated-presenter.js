import FilmsListPresenter from './films-list-presenter.js';

export default class FilmsListRatedPresenter extends FilmsListPresenter {
  constructor({container}, resetView) {
    super({container, title: 'Top rated', hiddenTitle: false, extra: true}, resetView);
  }

  prepearFilms = (films) => films.splice(0, 2);
}
