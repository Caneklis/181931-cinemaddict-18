import AbstractView from '../framework/view/abstract-view.js';
import {
  formatDate,
  formatDuration,
  toggleFilmsControlClass,
} from '../utils.js';

const createPopupTemplate = (film, comments) => {
  const {
    filmInfo: {
      actors,
      alternativeTitle,
      description,
      ageRating,
      genre: genres,
      poster,
      release: { date, releaseCountry },
      director,
      writers,
      runtime,
      title,
      totalRating,
    },
    userDetails: { watchlist, alreadyWatched, favorite },
  } = film;

  const { author, comment: text, emotion } = comments;

  const getGenresList = (genresList) =>
    genresList
      .map((genre) => `<span class="film-details__genre">${genre}</span>`)
      .join('\n');

  const createComment = () =>
    `
            <li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
              </span>
              <div>
                <p class="film-details__comment-text">${text}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${formatDate(
    date,
    'D/MMMM/YYYY HH:mm'
  )}</span>
                  <button class="film-details__comment-delete">Delete</button>
                </p>
              </div>
            </li>
            `;
  return `<section class="film-details">
  <div class="film-details__inner">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tbody><tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatDate(
    date,
    'D MMMM YYYY'
  )}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatDuration(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${getGenresList(genres)}</td>
            </tr>
          </tbody></table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist  ${toggleFilmsControlClass(
    watchlist,
    'film-details__control-button--active'
  )}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched  ${toggleFilmsControlClass(
    alreadyWatched,
    'film-details__control-button--active'
  )}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite  ${toggleFilmsControlClass(
    favorite,
    'film-details__control-button--active'
  )}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${
  comments.length
}</span></h3>

        <ul class="film-details__comments-list">
            ${comments.map(createComment).join('\n')}
        </ul>

        <form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </form>
      </section>
    </div>
  </div>
</section>`;
};

export default class PopupView extends AbstractView {
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createPopupTemplate(this.#film, this.#comments);
  }

  setCloseClickHandler = (callback) => {
    // Мы могли бы сразу передать callback в addEventListener,
    // но тогда бы для удаления обработчика в будущем,
    // нам нужно было бы производить это снаружи, где-то там,
    // где мы вызывали setClickHandler, что не всегда удобно

    // 1. Поэтому колбэк мы запишем во внутреннее свойство
    this._callback.click = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    // 3. А внутри абстрактного обработчика вызовем колбэк
    this._callback.click();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setArchiveClickHandler = (callback) => {
    this._callback.archiveClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#archiveClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #archiveClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.archiveClick();
  };
}
