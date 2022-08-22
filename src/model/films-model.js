import { generateCards } from '../mock/card.js';

export default class FilmsModel {
  #films = generateCards();

  get = () => this.#films;
}
