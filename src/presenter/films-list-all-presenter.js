import FilmsListPresenter from './films-list-presenter.js';
export default class FilmsListAllPresenter extends FilmsListPresenter {
  constructor({container}, resetView) {
    super({container, title: 'All movies. Upcoming', hiddenTitle: true, extra: false}, resetView);
  }
}
