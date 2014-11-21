'use strict';

var express = require('express');
var cors = require('cors');

var places = require('./controllers/api/places');
var needs = require('./controllers/api/needs');
var demands = require('./controllers/api/demands');
var strategies = require('./controllers/api/strategies');
var entity = require('./controllers/api/entity');
var type = require('./controllers/api/type');
var about = require('./controllers/about');
var error = require('./controllers/error');
var index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // API Routes
  var apiRouter = express.Router();
  apiRouter.use(cors()); //enable CORS on all API routes
  apiRouter.use('/places', places.router);
  apiRouter.use('/needs', needs.router);
  apiRouter.use('/demands', demands.router);
  apiRouter.use('/entity', entity.router);
  apiRouter.use('/type', type.router);
  apiRouter.use('/strategies', strategies.router);
  apiRouter.get('/', about.api); // api documentation page
  apiRouter.get('*', error.index); //404 on all undefined routes

  var apiPre = '/api/v1';
  app.use(apiPre, apiRouter);

  // Other Routes
  var siteRouter = express.Router();
  siteRouter.get('/about', about.about);
  siteRouter.get('/templates/*', index.templates);

  //Routes that correspond to the front-end Angular app
  siteRouter.get('/needs/*', index.index);
  siteRouter.get('/demands/*', index.index);
  siteRouter.get('/supplies/*', index.index);  //TODO: Phase 3
  siteRouter.get('/wms/*', index.index);       //TODO: Phase 4
  siteRouter.get('/', index.index);
  siteRouter.get('*', error.index); //404 on undefined routes

  app.use('/', siteRouter);
};
