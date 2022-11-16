import {generateComments} from '../mock/comment.js';
import Observable from '../framework/observable';
import { UpdateType } from '../const.js';

export default class CommentsModel extends Observable {
  #filmsModel = null;
  #allComments = [];
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get = (film) => {
    this.#comments = film.comments.map((commentId) => this.#allComments.find((comment) => comment.id === commentId)).filter(Boolean);
    return this.#comments;
  };

  init = async (film) => {
    try {
      const comments = await this.#commentsApiService.generateComments(film);
      this.#comments = comments.map(this.#adaptToClient);
      console.log(this.#comments);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  };

  add = (updateType, update) => {
    this.#allComments.push(update);
    this._notify(updateType, update);
  };

  delete = (updateType, update) => {
    const index = this.#allComments.findIndex((comment) => comment.id === update.commentId);
    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }
  };

  #adaptToClient = (comment) => ({
    ...comment,
  });
}
