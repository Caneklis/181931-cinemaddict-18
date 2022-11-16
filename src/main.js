import ProfileView from './view/profile-view.js';
import { render } from './framework/render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

import FilterPresenter from './presenter/filter-presenter.js';

import FilmsApiService from './films-api-server.js';
import CommentsApiService from './comments-api-service';

const AUTHORIZATION = 'Basic er777jdzbds';
const END_POINT = 'https://18.ecmascript.pages.academy/cinemaddict/';

const siteMainHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
// const commentsModel = new CommentsModel(filmsModel);

render(new ProfileView(), siteMainHeader);


const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filterModel);

filmsModel.init();
filmsPresenter.init();
filterPresenter.init();
