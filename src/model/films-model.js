import { generateCard } from '../mock/card.js';

export default class FilmsModel {
  #cards = Array.from({ length: 20 }, generateCard);

  get = () => this.#cards;
}
