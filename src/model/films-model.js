import Observable from '../framework/observable.js';
// import { generateCards } from '../mock/card.js';
import { UpdateType } from '../const.js';

export default class FilmsModel extends Observable {
  // #films = generateCards();
  #films = [];
  #filmsApiService = null;

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;

    this.#filmsApiService.films.then((films) => {
      // console.log(films.map(this.#adaptToClient));
      films.map(this.#adaptToClient);
    });
  }

  get = () => this.#films;

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  update = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [...this.#films.slice(0, index), update, ...this.#films.slice(index + 1)];

    this._notify(updateType, update);
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      userDetails: {...film['user_details'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date']
      },
      filmInfo: {...film['film_info'],
        ageRating: film['film_info']['age_rating'],
        alternativeTitle: film['film_info']['alternative_title'],
        totalRating: film['film_info']['total_rating'],
        release: {...film['film_info']['release'],
          releaseCountry: film['film_info']['release']['release_country']
        }
      },
    };

    delete adaptedFilm['user_details'];
    delete adaptedFilm['userDetails']['already_watched'];
    delete adaptedFilm['userDetails']['watching_date'];
    delete adaptedFilm['film_info'];
    delete adaptedFilm['filmInfo']['age_rating'];
    delete adaptedFilm['filmInfo']['alternative_title'];
    delete adaptedFilm['filmInfo']['total_rating'];
    delete adaptedFilm['filmInfo']['release']['release_country'];

    return adaptedFilm;
  };
}
