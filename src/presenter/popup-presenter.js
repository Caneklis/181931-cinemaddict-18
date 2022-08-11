import PopupView from '../view/popup-view.js';
import { render, RenderPosition } from '../render.js';

export default class PopupPresenter {
  cards;
  comments;
  constructor(cards, comments) {
    this.cards = cards;
    this.comments = comments;
  }

  init = (filmsContainer, filmPopupModel, popupComments) => {
    this.filmPopupModel = filmPopupModel;
    this.cards = [...this.filmPopupModel.getFilms()];

    this.popupComments = popupComments;
    this.comments = [...this.popupComments.getComments()];

    render(
      new PopupView(this.cards[1], this.comments),
      filmsContainer,
      RenderPosition.AFTEREND
    );
  };
}
