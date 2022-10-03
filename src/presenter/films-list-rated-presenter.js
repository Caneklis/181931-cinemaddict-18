import FilmsListPresenter from './films-list-presenter.js';

export default class FilmsListRatedPresenter extends FilmsListPresenter {
  constructor(options) {
    super({
      title: 'Top rated',
      hiddenTitle: false,
      extra: true, ...options});
  }

  prepearFilms = (films) => films.splice(0, 2);
}
