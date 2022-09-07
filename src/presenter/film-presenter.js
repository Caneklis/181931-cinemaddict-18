import PopupView from '../view/popup-view.js';
import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import { isEscapeKey } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN: 'OPEN'
};
export default class FilmPresenter {
  #container = null;
  #popup = null;
  #filmCardView = null;
  #changeData = null;
  #film = null;
  #isPopupOpen = false;
  #resetView = null;
  #mode = Mode.DEFAULT;

  constructor(container, changeData, resetView) {
    this.#container = container;
    this.#changeData = changeData;
    this.#resetView = resetView;
  }

  init = (film, comments) =>{
    this.#film = film;
    this.#renderFilm(film, comments);
  };

  #renderFilm(film,comments) {
    const oldFilmView = this.#filmCardView;
    this.#filmCardView = new FilmCardView(film);
    this.#filmCardView.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardView.setArchiveClickHandler(this.#handleArchiveClick);
    this.#filmCardView.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmCardView.setOpenClickHandler(()=>{this.#renderFilmPopup(film,comments);});

    if (oldFilmView === null) {
      render(this.#filmCardView, this.#container);
      return;
    }

    if (this.#container.contains(oldFilmView.element)) {
      replace(this.#filmCardView, oldFilmView);
    }

    this.#replaceFilmPopup(film, comments);

    remove(oldFilmView);
  }

  #updatePopup = (film, comments) => {
    this.#popup = new PopupView(film, comments);
    this.#popup.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popup.setArchiveClickHandler(this.#handleArchiveClick);
    this.#popup.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popup.setCloseClickHandler(this.#hideFilmPopup);
  };

  #renderFilmPopup = (film, comments) => {
    if (this.#mode === Mode.DEFAULT) {
      this.#resetView();
      window.addEventListener('keydown', this.#onWindowKeydown);
      document.body.classList.add('hide-overflow');
      this.#updatePopup(film, comments);
      render(this.#popup, document.body);
      this.#mode = Mode.OPEN;
    }
  };

  #replaceFilmPopup = (film, comments) => {
    if (this.#mode === Mode.OPEN) {
      const oldPopup = this.#popup;
      this.#updatePopup(film, comments);
      replace(this.#popup, oldPopup);
      remove(oldPopup);
    }
  };

  resetDetailsView = () => {
    if(this.#mode === Mode.OPEN) {
      this.#hideFilmPopup();
    }
  };

  #hideFilmPopup = () => {
    remove(this.#popup);
    this.#mode = Mode.DEFAULT;
    this.#popup = null;
    document.body.classList.remove('hide-overflow');
    window.removeEventListener('keydown', this.#onWindowKeydown);
  };

  destroy = () => {
    remove(this.#filmCardView);
    remove(this.#popup);
  };

  #onWindowKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#hideFilmPopup();
    }
  };

  #handleWatchListClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  };

  #handleArchiveClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  };
}
