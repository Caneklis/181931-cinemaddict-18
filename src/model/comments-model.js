// import { generateComment } from '../mock/comment.js';
import { generateComments } from '../mock/comment.js';

export default class CommentsModel {
  #filmsModel = null;
  #allComments = [];
  #comments = [];
  // #comments = generateComments;

  constructor(filmsModel) {
    this.#filmsModel = filmsModel;
    this.#generateAllComments();

  }

  #generateAllComments() {
    this.#allComments = generateComments(this.#filmsModel.get());
  }

  get = (film)=> {
    this.#comments = film.comments.map((commentId) => this.#allComments.find((comment)=>comment.id === commentId));

    return this.#comments;
  };

  // get comments() { return this.#comments;}

  // get commentsForFilm() { return this.#comments;}
}
