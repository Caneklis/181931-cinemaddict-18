import PopupView from '../view/popup-view.js';
import { render, RenderPosition } from '../render.js';

export default class PopupPresenter {
  init = (filmsContainer) => {
    render(new PopupView(), filmsContainer, RenderPosition.AFTEREND);
  };
}
