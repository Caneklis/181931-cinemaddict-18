import { createElement } from '../render.js';

const createFilmsListTemplate = (modifier, title) =>
  `<section class="films-list ${modifier}">${title}</section>`;

export default class FilmsListView {
  modifier;
  title;

  constructor(modifier = '', title = '') {
    this.modifier = modifier;
    this.title = title;
  }

  getTemplate() {
    return createFilmsListTemplate(this.modifier, this.title);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
