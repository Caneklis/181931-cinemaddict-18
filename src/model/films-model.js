import { generateCards } from '../mock/card.js';

export default class FilmsModel {
  #cards = generateCards();

  get = () => this.#cards;
}
