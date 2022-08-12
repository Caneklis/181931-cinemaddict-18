import ProfileView from './view/profile-view.js';
import { render } from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
// import PopupPresenter from './presenter/film-presenter.js';
// import FilmsModel from './model/films-model.js';
// import popupComments from './model/comments-model.js';

const siteMainHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
// const siteFooterElement = document.querySelector('.footer');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

render(new ProfileView(), siteMainHeader);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

filmsPresenter.init();
