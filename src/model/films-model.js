import { generateCard } from '../mock/card.js';

export default class FilmsModel {
  cards = Array.from({ length: 5 }, generateCard);

  getFilms = () => this.cards;
}
