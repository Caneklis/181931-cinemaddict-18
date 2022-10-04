import FilmsListPresenter from './films-list-presenter.js';

export default class FilmsListMostCommentedPresenter extends FilmsListPresenter {
  constructor(options) {
    super({
      title: 'Most commented',
      hiddenTitle: false,
      extra: true, ...options});
  }

  prepareFilms = (films) => films.slice(0, 2);
}
