import PopupView from '../view/popup-view.js';
import {remove, render, replace} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import {isEscapeKey} from '../utils/common.js';
import {UpdateType, UserAction} from '../const.js';
import { nanoid } from 'nanoid';

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
  #resetView = null;
  #mode = Mode.DEFAULT;

  get isPopupOpen() {
    return this.#mode === Mode.OPEN;
  }

  constructor(container, changeData, resetView) {
    this.#container = container;
    this.#changeData = changeData;
    this.#resetView = resetView;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#renderFilm(film, comments);
  };

  #renderFilm(film, comments) {
    const oldFilmView = this.#filmCardView;
    this.#filmCardView = new FilmCardView(film);
    this.#filmCardView.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardView.setArchiveClickHandler(this.#handleArchiveClick);
    this.#filmCardView.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmCardView.setOpenClickHandler(() => {
      this.#renderFilmPopup(film, comments);
    });

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

  #getUpdateType = (isChecked, isFiltered) => !isChecked && isFiltered ? UpdateType.MINOR : UpdateType.PATCH;

  #createPopup = (film, comments) => {
    this.#popup = new PopupView(film, comments);
    this.#popup.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popup.setArchiveClickHandler(this.#handleArchiveClick);
    this.#popup.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popup.setCloseClickHandler(this.#hideFilmPopup);
    this.#popup.setDeleteCommentHandlers(this.#handleDeleteCommentClick);
  };

  #renderFilmPopup = (film, comments) => {
    if (this.#mode === Mode.DEFAULT) {
      this.#resetView();
      window.addEventListener('keydown', this.#onWindowKeydown);
      document.body.classList.add('hide-overflow');
      this.#createPopup(film, comments);
      render(this.#popup, document.body);
      this.#mode = Mode.OPEN;

      this.#popup.setFormSubmitHandler((update) => {
        this.#handleFormSubmit(update);
      });
    }
  };

  #replaceFilmPopup = (film, comments) => {
    if (this.#mode === Mode.OPEN) {
      this.#popup.reset(film, comments);
    }
  };

  resetDetailsView = () => {
    if (this.#mode === Mode.OPEN) {
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

  #handleFormSubmit = (update) => {

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, comments: {id: nanoid(), ...update}},
    );

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      update,
    );
  };

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
    );
  };

  #handleArchiveClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}},
    );
  };

  #handleDeleteCommentClick = (update) => {
    const comments = [...this.#film.comments];
    const commentIndex = comments.findIndex((commentId) => commentId === update.commentId);

    if (commentIndex > -1) {
      this.#changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...this.#film, comments: [...comments.slice(0, commentIndex), ...comments.slice(commentIndex + 1)]},
      );

      this.#changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        update,
      );
    }
  };
}
