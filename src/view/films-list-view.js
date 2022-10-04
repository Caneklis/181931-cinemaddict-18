import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListTemplate = (title, hiddenTitle, extra) =>
  `<section class="films-list  ${
    extra ? ' films-list--extra' : ''
  }"><h2 class="films-list__title  ${
    hiddenTitle ? ' visually-hidden' : ''
  } ">${title}</h2></section>`;

export default class FilmsListView extends AbstractView {
  #title = null;
  #hiddenTitle = null;
  #extra = null;

  constructor(title = '', hiddenTitle, extra) {
    super();
    this.#title = title;
    this.#hiddenTitle = hiddenTitle;
    this.#extra = extra;
  }

  get template() {
    return createFilmsListTemplate(this.#title, this.#hiddenTitle, this.#extra);
  }

  setExtraType() {
    this.isExtraType = true;

    if (this.isExtraType) {
      this.element.classList.add('films-list--extra');
    }
  }
}
