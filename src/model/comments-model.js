import { generateComment } from '../mock/comment.js';

export default class CommentsModel {
  #comments = Array.from({ length: 10 }, generateComment);

  get comments() { return this.#comments;}

  get commentsForFilm() { return this.#comments;}
}
