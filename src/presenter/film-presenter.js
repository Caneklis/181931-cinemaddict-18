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
  #changeMode = null;
  #resetView = null;
  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode, resetView) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
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

    remove(oldFilmView);
  }

  #renderFilmPopup = (film,comments) => {
    if(this.#mode === Mode.DEFAULT) {
      this.#resetView();
      //Тут я хотел сделать, как выше с карточкой, но тоже не вышло
      // const oldFilmView = this.#popup;

      this.#popup = new PopupView(film, comments);
      document.body.classList.add('hide-overflow');

      // if (oldFilmView === null) {
      //   render(this.#popup, document.body);
      //   return;
      // }

      // if (this.#container.contains(oldFilmView.element)) {
      //   replace(this.#popup, oldFilmView);
      // }

      // remove(oldFilmView);

      render(this.#popup, document.body);
      this.#popup.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#popup.setArchiveClickHandler(this.#handleArchiveClick);
      this.#popup.setWatchListClickHandler(this.#handleWatchListClick);
      this.#popup.setCloseClickHandler(this.#hideFilmPopup);
      window.addEventListener('keydown', this.#onWindowKeydown);
      this.#mode = Mode.OPEN;
    }
  };

  #updateDetailsComponent = () => {
    if(this.#mode === Mode.OPEN) {
      this.resetDetailsView();
      // this.#renderFilmPopup(); //Если я просто перерендериваю выскакиевает ошибка, хотя данные меняются
    }
  };

  resetDetailsView = () => {
    if(this.#mode === Mode.OPEN) {
      this.#hideFilmPopup();
      //Тут мне кажетя должен быть replace, но у меня не получается его добавить.
    }
  };

  #hideFilmPopup = () => {
    remove(this.#popup);
    this.#mode = Mode.DEFAULT;
    this.#popup = null;
    document.body.classList.remove('hide-overflow');
    window.removeEventListener('keydown', this.#onWindowKeydown);

  };

  #onWindowKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#hideFilmPopup();
    }
  };

  #handleWatchListClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
    this.#updateDetailsComponent();
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
    this.#updateDetailsComponent();
  };

  #handleArchiveClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
    this.#updateDetailsComponent();
  };
}
