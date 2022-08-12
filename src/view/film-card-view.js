import { createElement } from '../render.js';
import {
  formatDate,
  formatDuration,
  toggleFilmsControlClass,
} from '../utils.js';

const createFilmCardTemplate = (card) => {
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
  } = card;

  return `<article class="film-card"  id="${id}">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${formatDate(
    date,
    'D MMMM YYYY'
  )}</span>
              <span class="film-card__duration">${formatDuration(
    runtime
  )}}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description}</p>
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

export default class filmCardView {
  card;

  constructor(card) {
    this.card = card;
  }

  getTemplate() {
    return createFilmCardTemplate(this.card);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
