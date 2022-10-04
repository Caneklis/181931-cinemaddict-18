import FilmsListPresenter from './films-list-presenter.js';

export default class FilmsListRatedPresenter extends FilmsListPresenter {
  constructor(options) {
    super({
      title: 'Top rated',
      hiddenTitle: false,
      extra: true, ...options});
  }

  prepareFilms = (films) => films.slice(0, 2);
}
