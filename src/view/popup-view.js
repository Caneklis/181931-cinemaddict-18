import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  formatDate,
  formatDuration,
  toggleFilmsControlClass,
} from '../utils.js';
import { emotions } from '../const.js';
import dayjs from 'dayjs';

const createSmile = (emotion) => emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">` : '';

const createEmojiButton = (emotion, isChecked) => `
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"
            id="emoji-${emotion}"
            value="${emotion}"
            ${isChecked ? ' checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-${emotion}">
              <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji" data-emotion="${emotion}">
            </label>`;

const createEmojiButtons = (current) => {
  const buttonsList = emotions.map((emotion) => createEmojiButton(emotion, current === emotion)).join('');
  return `
    <div class="film-details__emoji-list">
      ${buttonsList}
    </div>`;
};

const createPopupTemplate = ({film, comments, message, emotionSelect}) => {
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

  const getGenresList = (genresList) =>
    genresList
      .map((genre) => `<span class="film-details__genre">${genre}</span>`)
      .join('\n');

  const releaseDate = dayjs(date).format('D MMMM YYYY');

  const createComment = (comment) => {

    const { author, comment: text, emotion: commentEmotion, date: commentDate } = comment;

    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${commentEmotion}.png" width="55" height="55" alt="emoji-${commentEmotion}">
              </span>
              <div>
                <p class="film-details__comment-text">${text}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${formatDate(commentDate, 'D MMMM YYYY')}</span>
                  <button class="film-details__comment-delete">Delete</button>
                </p>
              </div>
            </li>
            `;
  };


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
              <td class="film-details__cell">${releaseDate}</td>
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

 ${comments.length > 0 ? `<ul class="film-details__comments-list">
            ${comments.map(createComment).join('\n')}
        </ul>` : ''}


        <form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label">${createSmile(emotionSelect)}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" name="comment" placeholder="Select reaction below and write comment here">${message ? message : ''}</textarea>
          </label>

          ${createEmojiButtons(emotionSelect)}
        </form>
      </section>
    </div>
  </div>
</section>`;
};

export default class PopupView extends AbstractStatefulView {
  #changeData = null;

  constructor(film, comments) {
    super();
    this._state = PopupView.parseFilmToState(film, comments);
    this.#setInnerHandlers();
  }

  static parseFilmToState = (film,comments) => ({
    film,
    comments,
    emotionSelect: null,
    message: null,
    scroll: null,
  });

  get template() {
    return createPopupTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#archiveClickHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.#addEmotionHandler();
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#messageInputHandler);
    this.element.scrollTop = this._state.scroll;
    this.element.addEventListener('scroll', this.#positionScrollHandler);

    if (this.element.querySelector('.film-details__comments-list')) {
      this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentHandler);
    }

  };

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setArchiveClickHandler = (callback) => {
    this._callback.archiveClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#archiveClickHandler);
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


  #addEmotionHandler() {
    const emotionsItems = this.element.querySelectorAll ('.film-details__emoji-item');
    for (const emotion of emotionsItems) {
      emotion.addEventListener ('change', this.#emotionClickHandler);
    }
  }

  #positionScrollHandler = () => {
    this._setState({
      scroll: this.element.scrollTop
    });
  };

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement ({
      emotionSelect: evt.target.value
    });
  };

  #messageInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      message: evt.target.value
    });
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
  };

  #deleteCommentHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    this._callback.deleteComment(Number(evt.target.dataset.id));
  };
}
