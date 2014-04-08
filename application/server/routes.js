'use strict';

var places = require('./controllers/api/places'),
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

  var apiPre = '/api/v1/';

  // Enable CORS
  app.all(apiPre + '*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // Server API Routes
  app.get(apiPre + 'places/regions', places.getRegionList);
  app.get(apiPre + 'places/regions.topojson', places.getRegionTopoJson);
  app.get(apiPre + 'places/county/:name.geojson', places.getCountyGeoJsonByName);
  app.get(apiPre + 'places/counties', places.getCountyList);
  app.get(apiPre + 'places/counties.geojson', places.getCountyGeoJson);

  app.get(apiPre + 'needs', needs.getAllNeeds);
  app.get(apiPre + 'needs/summary', needs.getRegionSummary);
  app.get(apiPre + 'needs/region/:region', needs.getNeedsForRegion);
  app.get(apiPre + 'needs/county/:county', needs.getNeedsForCounty);
  app.get(apiPre + 'needs/entity/:entityId', needs.getNeedsForEntity);
  app.get(apiPre + 'needs/type/:entityType', needs.getNeedsForEntityType);

  app.get(apiPre + 'demands', demands.getAllDemands);
  app.get(apiPre + 'demands/summary', demands.getRegionSummary);
  app.get(apiPre + 'demands/region/:region', demands.getDemandsForRegion);
  app.get(apiPre + 'demands/county/:county', demands.getDemandsForCounty);
  app.get(apiPre + 'demands/entity/:entityId', demands.getDemandsForEntity);
  app.get(apiPre + 'demands/type/:entityType', demands.getDemandsForEntityType);

  app.get(apiPre + 'entity', entity.getEntities);
  app.get(apiPre + 'entity/search', entity.getEntitiesByNamePartial);
  app.get(apiPre + 'entity/:entityId', entity.getEntity);
  app.get(apiPre + 'entity/:entityId/summary', entity.getEntitySummary);

  app.get(apiPre + 'type/entity', type.getEntityTypes);

  // All undefined api routes should return a 404
  app.get('/api/*', error.index);

  app.get('/about', about.about);

  app.get('/partials/*', index.partials);
  app.get('/templates/*', index.templates);

  //Routes that correspond to the front-end Angular app
  app.get('/needs/*', index.index);
  app.get('/demands/*', index.index);
  app.get('/supplies/*', index.index);  //TODO: Phase 3
  app.get('/wms/*', index.index);       //TODO: Phase 4
  app.get('/', index.index);

  //Anything else is a 404
  app.get('/*', error.index);
};
