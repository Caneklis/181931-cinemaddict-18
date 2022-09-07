import AbstractView from '../framework/view/abstract-view.js';
import {
  formatDate,
  formatDuration,
  toggleFilmsControlClass,
} from '../utils.js';

const DESCRIPTION_COUNT = 140;

const createFilmCardTemplate = (film) => {
  const {
    id,
    comments,
    filmInfo: {
      title,
      totalRating,
      poster,
      runtime,
      genre,
      description,
      release: { date },
    },
    userDetails: { watchlist, alreadyWatched, favorite },
  } = film;

  return `<article class="film-card"  id="${id}">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${date !== null ? `${formatDate(date, 'D MMMM YYYY')}` : ''}</span>
              <span class="film-card__duration">${formatDuration(runtime)}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description.length > DESCRIPTION_COUNT ? `${description.slice(0,DESCRIPTION_COUNT)}...` : description}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist  ${toggleFilmsControlClass(
    watchlist,
    'film-card__controls-item--active'
  )}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched  ${toggleFilmsControlClass(
    alreadyWatched,
    'film-card__controls-item--active'
  )}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite  ${toggleFilmsControlClass(
    favorite,
    'film-card__controls-item--active'
  )}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class filmCardView extends AbstractView {
  #film = null;
  #element = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  setOpenClickHandler = (callback) => {
    // Мы могли бы сразу передать callback в addEventListener,
    // но тогда бы для удаления обработчика в будущем,
    // нам нужно было бы производить это снаружи, где-то там,
    // где мы вызывали setClickHandler, что не всегда удобно

    // 1. Поэтому колбэк мы запишем во внутреннее свойство
    this._callback.click = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    // 3. А внутри абстрактного обработчика вызовем колбэк
    this._callback.click();
  };

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setWatchListClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setArchiveClickHandler = (callback) => {
    this._callback.archiveClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#archiveClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.archiveClick();
  };

  #archiveClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.archiveClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
