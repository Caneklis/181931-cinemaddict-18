import PopupView from '../view/popup-view.js';
import { render, RenderPosition } from '../render.js';
import FilmCardView from '../view/film-card-view.js';
import { isEscapeKey } from '../utils.js';
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
    this.popup = new PopupView(film, comments);

    if (!this.#popup) {
      this.#isPopupOpen = true;
      this.#popup = new PopupView(film, comments);
      render(this.#popup, document.querySelector('.footer'),
        RenderPosition.AFTEREND);
      document.body.classList.add('hide-overflow');

      const popupCloseButton = this.#popup.element.querySelector('.film-details__close-btn');
      popupCloseButton.addEventListener('click', ()=>{
        this.#hideFilmPopup();
      });
      document.body.classList.add('hide-overflow');
      document.body.appendChild(this.#popup.element);
      window.addEventListener('keydown', this.#onWindowKeydown);
    }
  };

  #hideFilmPopup(){
    if (this.#isPopupOpen) {
      this.#popup.element.remove();
      this.#popup = null;
      document.body.classList.remove('hide-overflow');
    }
  }

  #onWindowKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#hideFilmPopup();
    }
  };
}
