import { createElement } from '../render.js';

const createFilmsListTemplate = (title, hiddenTitle, extra) =>
  `<section class="films-list  ${
    extra ? ' films-list--extra' : ''
  }"><h2 class="films-list__title  ${
    hiddenTitle ? ' visually-hidden' : ''
  } ">${title}</h2></section>`;

export default class FilmsListView {
  #title = null;
  #hiddenTitle = null;
  #extra = null;
  #element = null;

  constructor(title = '', hiddenTitle, extra) {
    this.#title = title;
    this.#hiddenTitle = hiddenTitle;
    this.#extra = extra;
  }

  get template() {
    return createFilmsListTemplate(this.#title, this.#hiddenTitle, this.#extra);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  setExtraType() {
    this.isExtraType = true;

    if (this.isExtraType) {
      this.element.classList.add('films-list--extra');
    }
  }

  removeElement() {
    this.#element = null;
  }
}
