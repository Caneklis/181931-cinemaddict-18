import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListTemplate = () =>
  '<div class="films-list__container"></div>';

export default class FilmsListContainerView extends AbstractView {
  get template() {
    return createFilmsListTemplate();
  }
}
