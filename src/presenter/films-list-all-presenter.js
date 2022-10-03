import FilmsListPresenter from './films-list-presenter.js';
export default class FilmsListAllPresenter extends FilmsListPresenter {
  constructor(options) {
    super({
      title: 'All movies. Upcoming',
      hiddenTitle: true,
      extra: false,
      ...options}
    );
  }
}
