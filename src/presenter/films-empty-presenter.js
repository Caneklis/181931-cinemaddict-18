import FilmsListPresenter from './films-list-presenter.js';

export default class FilmsEmptyListPresenter extends FilmsListPresenter {
  constructor({container}) {
    super({container, title: 'There are no movies in our database', hiddenTitle: false, extra: false});
  }
}
