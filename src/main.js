import ProfileView from './view/profile-view.js';
import { render } from './framework/render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';

const siteMainHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);

render(new ProfileView(), siteMainHeader);

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

filmsPresenter.init();
