import PopupView from '../view/popup-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import { isEscapeKey } from '../utils/common.js';
export default class FilmPresenter {
  #container = null;
  #popup = null;
  #isPopupOpen = false;

  constructor(container) {
    this.#container = container;
  }

  init = (film, comments) =>{
    this.#renderFilm(film, comments);
  };

  #renderFilm(film,comments) {
    const filmCardView = new FilmCardView(film);
    render(filmCardView, this.#container);

    filmCardView.element.querySelector('.film-card__link').addEventListener('click', () => {
      this.#renderFilmPopup(film,comments);
    });
  }

  #renderFilmPopup = (film,comments) => {

    if (!this.#popup) {
      this.#isPopupOpen = true;
      this.#popup = new PopupView(film, comments);
      render(this.#popup, document.querySelector('.footer'),
        RenderPosition.AFTEREND);
      document.body.classList.add('hide-overflow');
      this.#popup.setClickHandler(this.hideFilmPopup);
      document.body.appendChild(this.#popup.element);
      window.addEventListener('keydown', this.#onWindowKeydown);
    }

  };

  hideFilmPopup = () => {
    if (this.#isPopupOpen) {
      remove(this.#popup);
      this.#popup = null;
      document.body.classList.remove('hide-overflow');
      window.removeEventListener('keydown', this.#onWindowKeydown);
    }
  };

  #onWindowKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.hideFilmPopup();
    }
  };
}
