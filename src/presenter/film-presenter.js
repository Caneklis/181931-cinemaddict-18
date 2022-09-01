import PopupView from '../view/popup-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import { isEscapeKey } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN: 'OPEN'
};
export default class FilmPresenter {
  #container = null;
  #popup = null;
  #isPopupOpen = false;
  #filmCardView = null;
  #changeData = null;
  #film = null;

  #changeMode = null;

  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, comments) =>{
    this.#renderFilm(film, comments);
  };

  #renderFilm(film,comments) {
    this.#filmCardView = new FilmCardView(film);
    render(this.#filmCardView, this.#container);

    this.#filmCardView.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardView.setArchiveClickHandler(this.#handleArchiveClick);

    this.#filmCardView.setOpenClickHandler(()=>{this.renderFilmPopup(film,comments);});
  }

  #handleFavoriteClick = () => {
    console.log(this.#film);
    this.#changeData({...this.#film.userDetails.favorite , favorite: !this.#film.userDetails.favorite});
  };

  #handleArchiveClick = () => {
    this.#changeData({...this.#film.userDetails.alreadyWatched, alreadyWatched: !this.#film.userDetails.alreadyWatched});
  };

  destroy = () => {
    remove(this.#filmCardView);
  };

  renderFilmPopup = (film,comments) => {

    if (this.#mode === Mode.DEFAULT) {
      this.#isPopupOpen = true;
      this.#mode = Mode.OPEN;
      console.log(this.#mode);
      this.#popup = new PopupView(film, comments);

      render(this.#popup, document.querySelector('.footer'),
        RenderPosition.AFTEREND);
      document.body.classList.add('hide-overflow');
      this.#popup.setCloseClickHandler(this.hideFilmPopup);
      document.body.appendChild(this.#popup.element);

      this.#popup.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#popup.setArchiveClickHandler(this.#handleArchiveClick);
      window.addEventListener('keydown', this.#onWindowKeydown);

    }

  };

  resetView = () => {
    this.hideFilmPopup();
  };

  hideFilmPopup = () => {
    if (this.#isPopupOpen) {
      remove(this.#popup);
      this.#mode = Mode.DEFAULT;
      console.log(this.#mode);
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
