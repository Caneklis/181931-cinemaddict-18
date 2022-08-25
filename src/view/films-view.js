import AbstractView from '../framework/view/abstract-view.js';

const createFilmsContainerTemplate = () => '<div class="films"></div>';

export default class FilmsView extends AbstractView {
  get template() {
    return createFilmsContainerTemplate();
  }
}
