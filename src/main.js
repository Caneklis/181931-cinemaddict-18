import ProfileView from './view/profile-view.js';
import { render } from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';

const siteMainHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(new ProfileView(), siteMainHeader);
const filmsPresenter = new FilmsPresenter();

filmsPresenter.init(siteMainElement);

render(new ProfileView(), siteMainHeader);
const popupPresenter = new PopupPresenter();

popupPresenter.init(siteFooterElement);
