import { createElement } from '../render.js';

const createFilmsListTemplate = (title, hiddenTitle, extra) =>
  `<section class="films-list  ${
    extra ? ' films-list--extra' : ''
  }"><h2 class="films-list__title  ${
    hiddenTitle ? ' visually-hidden' : ''
  } ">${title}</h2></section>`;

export default class FilmsListView {
  title;
  hiddenTitle;
  extra;

  constructor(title = '', hiddenTitle, extra) {
    this.title = title;
    this.hiddenTitle = hiddenTitle;
    this.extra = extra;
  }

  getTemplate() {
    return createFilmsListTemplate(this.title, this.hiddenTitle, this.extra);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  setExtraType() {
    this.isExtraType = true;

    if (this.isExtraType) {
      this.element.classList.add('films-list--extra');
    }
  }

  removeElement() {
    this.element = null;
  }
}
