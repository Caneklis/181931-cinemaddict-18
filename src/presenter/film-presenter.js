import PopupView from '../view/popup-view.js';
import { render, RenderPosition } from '../render.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPresenter {
  constructor(container) {
    this.container = container;
  }

  init = ( film, comments) => {
    const filmCardView = new FilmCardView(film);
    render(filmCardView, this.container);

    this.popup = new PopupView(film, comments);

    filmCardView.getElement().addEventListener('click', ()=>{
      render(
        this.popup,
        document.querySelector('.footer'),
        RenderPosition.AFTEREND
      );
    });
  };
}
