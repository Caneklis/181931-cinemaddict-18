import ProfileView from './view/profile-view.js';
import { render } from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import FilmsModel from './model/films-model.js';
import popupComments from './model/comments-model.js';

const siteMainHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(new ProfileView(), siteMainHeader);
const filmsPresenter = new FilmsPresenter();

filmsPresenter.init(siteMainElement);

const popupPresenter = new PopupPresenter();

const filmPopupModel = new FilmsModel();
popupPresenter.init(siteFooterElement, filmPopupModel, new popupComments());
