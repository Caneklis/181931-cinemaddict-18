import PopupView from '../view/popup-view.js';
import { render, RenderPosition } from '../render.js';
import FilmCardView from '../view/film-card-view.js';

const ESCAPE_KEY_NAME = 'Escape';

const isEscapeKey = (evt) => evt.key === ESCAPE_KEY_NAME;
export default class FilmPresenter {
  #container = null;
  #popup = null;
  #isOpened = false;

  constructor(container) {
    this.#container = container;
  }


  init = ( film, comments) => {
    // const filmCardView = new FilmCardView(film);
    // render(filmCardView, this.#container);

    // this.popup = new PopupView(film, comments);

    // filmCardView.element.addEventListener('click', ()=>{
    //   render(
    //     this.popup,
    //     document.querySelector('.footer'),
    //     RenderPosition.AFTEREND
    //   );
    // });


    const cardComponent = new FilmCardView(film, comments);
    const hideDetailsComponent = () => {
      this.#popup.element.remove();
      document.body.classList.remove('hide-overflow');
    };

    const onWindowKeydown = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        hideDetailsComponent();
        window.removeEventListener('keydown', onWindowKeydown);
      }
    };

    const viewDetailsComponent = () => {
      if (document.body.querySelector('.film-details')) {
        return;
      }
      if (!this.#popup) {
        this.#popup = new PopupView(film, comments);
        render(this.#popup, document.querySelector('.footer'),
          RenderPosition.AFTEREND);
        this.#popup.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
          hideDetailsComponent();
          window.removeEventListener('keydown', onWindowKeydown);
        });
      }

      document.body.classList.add('hide-overflow');
      document.body.appendChild(this.#popup.element);
      window.addEventListener('keydown', onWindowKeydown);
    };

    cardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      viewDetailsComponent();
    });
    render(cardComponent, this.#container);
  };
}
