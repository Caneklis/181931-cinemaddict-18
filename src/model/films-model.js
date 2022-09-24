import Observable from '../framework/observable.js';
import { generateCards } from '../mock/card.js';

export default class FilmsModel extends Observable {
  #films = generateCards();

  get = () => this.#films;

  update = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [...this.#films.slice(0, index), update, ...this.#films.slice(index + 1)];

    this._notify(updateType, update);
  };
}
