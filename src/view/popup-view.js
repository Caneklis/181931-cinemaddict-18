import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formatDate, formatDuration, toggleFilmsControlClass,} from '../utils.js';
import {emotions} from '../const.js';
import dayjs from 'dayjs';
import he from 'he';

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
      release: {date, releaseCountry},
      director,
      writers,
      runtime,
      title,
      totalRating,
    },
    userDetails: {watchlist, alreadyWatched, favorite},
  } = film;

  const getGenresList = (genresList) =>
    genresList
      .map((genre) => `<span class="film-details__genre">${genre}</span>`)
      .join('\n');

  const releaseDate = dayjs(date).format('D MMMM YYYY');

  const createComment = (comment) => {
    const {id, author, comment: text, emotion: commentEmotion, date: commentDate} = comment;

    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${commentEmotion}.png" width="55" height="55" alt="emoji-${commentEmotion}">
              </span>
              <div>
                <p class="film-details__comment-text">${text}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${formatDate(commentDate, 'D MMMM YYYY')}</span>
                  <button class="film-details__comment-delete" data-id="${id}">Delete</button>
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
            <textarea class="film-details__comment-input" name="comment" placeholder="Select reaction below and write comment here">${message ? he.encode(message) : ''}</textarea>
          </label>

          ${createEmojiButtons(emotionSelect)}
        </form>
      </section>
    </div>
  </div>
</section>`;
};

export default class PopupView extends AbstractStatefulView {

  constructor(film, comments) {
    super();

    this.init(film, comments);
    this.#setInnerHandlers();
  }

  init = (film, comments) => {
    this._setState(PopupView.parseFilmToState(film, comments));
  };

  reset = (film, comments) => {
    this.updateElement(PopupView.parseFilmToState(film, comments));
  };

  updateElementWithSavedScrollPosition = (update) => {
    this.#saveScrollPosition();
    this.updateElement(update);
  };

  static parseFilmToState = (film, comments) => ({
    film,
    comments,
    emotionSelect: null,
    message: null,
  });

  get template() {
    return createPopupTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();

    this.setCloseClickHandler(this._callback.closeClick);

    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchListClickHandler(this._callback.watchlistClick);
    this.setArchiveClickHandler(this._callback.archiveClick);
    this.setDeleteCommentHandlers(this._callback.deleteComment);
    this.setFormSubmitHandler(this._callback.formSubmit);

    this.#restoreScrollPosition();
  };

  #setInnerHandlers = () => {
    this.#setEmotionClickHandlers();
    this.#setMessageInputHandler();
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#formSubmitHandler);
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#saveScrollPosition();
    this._callback.watchlistClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#saveScrollPosition();
    this._callback.favoriteClick();
  };

  setArchiveClickHandler = (callback) => {
    this._callback.archiveClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#archiveClickHandler);
  };

  #archiveClickHandler = (evt) => {
    evt.preventDefault();
    this.#saveScrollPosition();
    this._callback.archiveClick();
  };

  setDeleteCommentHandlers = (callback) => {
    this._callback.deleteComment = callback;
    this.element
      .querySelectorAll('.film-details__comment-delete')
      .forEach((e) => e.addEventListener('click', this.#deleteCommentHandler));
  };

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.dataset?.id;

    if (this._state.comments.some((comment) => comment.id === commentId)) {
      this.#saveScrollPosition();
      this._callback.deleteComment({commentId, filmId: this._state.film.id});

      // this.updateElement({...this._state});
    } else {
      throw new Error(`Film doesnt have comment with id ${commentId}`);
    }
  };

  #setEmotionClickHandlers() {
    const emotionsItems = this.element.querySelectorAll('.film-details__emoji-item');
    for (const emotion of emotionsItems) {
      emotion.addEventListener('change', this.#emotionClickHandler);
    }
  }

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElementWithSavedScrollPosition({
      emotionSelect: evt.target.value
    });
  };

  #setMessageInputHandler = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#messageInputHandler);
  };

  #messageInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      message: evt.target.value
    });
  };

  #formSubmitHandler = (evt) => {
    if(!this._state.emotionSelect || !this._state.message) {
      return;
    }

    evt.preventDefault();
    if(evt.ctrlKey === true && evt.key === 'Enter') {
      this._callback.formSubmit({comment: this._state.message, emotion: this._state.emotionSelect, filmId: this._state.film.id});
      document.removeEventListener('keydown', this.#formSubmitHandler);
    }
  };


  #restoreScrollPosition = () => {
    this.element.scrollTop = this._state.scroll;
  };

  #saveScrollPosition = () => {
    this._setState({
      scroll: this.element.scrollTop
    });
  };
}
