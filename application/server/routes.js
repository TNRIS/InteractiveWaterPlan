'use strict';

var express = require('express'),
    places = require('./controllers/api/places'),
    needs = require('./controllers/api/needs'),
    demands = require('./controllers/api/demands'),
    entity = require('./controllers/api/entity'),
    type = require('./controllers/api/type'),
    about = require('./controllers/about'),
    error = require('./controllers/error'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  var router = express.Router();

  var apiPre = '/api/v1';

  // Enable CORS
  router.all(apiPre + '*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // Server API Routes
  router.get(apiPre, about.api);

  router.get(apiPre + '/places/regions', places.getRegionList);
  router.get(apiPre + '/places/regions.topojson', places.getRegionTopoJson);
  router.get(apiPre + '/places/county/:name.geojson', places.getCountyGeoJsonByName);
  router.get(apiPre + '/places/counties', places.getCountyList);
  router.get(apiPre + '/places/counties.geojson', places.getCountyGeoJson);

  router.get(apiPre + '/needs', needs.getAllNeeds);
  router.get(apiPre + '/needs/summary', needs.getRegionSummary);
  router.get(apiPre + '/needs/region/:region', needs.getNeedsForRegion);
  router.get(apiPre + '/needs/county/:county', needs.getNeedsForCounty);
  router.get(apiPre + '/needs/entity/:entityId', needs.getNeedsForEntity);
  router.get(apiPre + '/needs/type/:entityType', needs.getNeedsForEntityType);

  router.get(apiPre + '/demands', demands.getAllDemands);
  router.get(apiPre + '/demands/summary', demands.getRegionSummary);
  router.get(apiPre + '/demands/region/:region', demands.getDemandsForRegion);
  router.get(apiPre + '/demands/county/:county', demands.getDemandsForCounty);
  router.get(apiPre + '/demands/entity/:entityId', demands.getDemandsForEntity);
  router.get(apiPre + '/demands/type/:entityType', demands.getDemandsForEntityType);

  router.get(apiPre + '/entity', entity.getEntities);
  router.get(apiPre + '/entity/search', entity.getEntitiesByNamePartial);
  router.get(apiPre + '/entity/:entityId', entity.getEntity);
  router.get(apiPre + '/entity/:entityId/summary', entity.getEntitySummary);

  router.get(apiPre + '/type/entity', type.getEntityTypes);

  // All undefined api routes should return a 404
  router.get('/api/*', error.index);

  router.get('/about', about.about);

  router.get('/templates/*', index.templates);

  //Routes that correspond to the front-end Angular app
  router.get('/needs/*', index.index);
  router.get('/demands/*', index.index);
  router.get('/supplies/*', index.index);  //TODO: Phase 3
  router.get('/wms/*', index.index);       //TODO: Phase 4
  router.get('/', index.index);

  //Anything else is a 404
  router.get('/*', error.index);

  app.use('/', router);
};
