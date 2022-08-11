import { generateComment } from '../mock/comment.js';

export default class CommentsModel {
  comments = Array.from({ length: 10 }, generateComment);

  getComments = () => this.comments;
}
