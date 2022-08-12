import FilmsListPresenter from './films-list-presenter.js';

export default class FilmsListMostCommentedPresenter extends FilmsListPresenter {
  constructor({container}) {
    super({container, title: 'Most commented', hiddenTitle: false, extra: true});
  }

  prepearFilms = (films) => films.splice(0, 2);
}
