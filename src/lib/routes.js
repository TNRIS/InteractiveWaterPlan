'use strict';

var places = require('./controllers/api/places'),
    needs = require('./controllers/api/needs'),
    entity = require('./controllers/api/entity'),
    type = require('./controllers/api/type'),
    about = require('./controllers/about'),
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
  app.get(apiPre + 'regions', places.getRegionList);
  app.get(apiPre + 'counties', places.getCountyList);
  app.get(apiPre + 'regions.topojson', places.getRegionTopoJson);

  app.get(apiPre + 'needs', needs.getAllNeeds);
  app.get(apiPre + 'needs/region/:region', needs.getNeedsForRegion);
  app.get(apiPre + 'needs/county/:county', needs.getNeedsForCounty);
  app.get(apiPre + 'needs/type/:entityType', needs.getNeedsForEntityType);
  app.get(apiPre + 'needs/entity/:entityId', needs.getNeedsForEntity);

  app.get(apiPre + 'entity', entity.getEntities);
  app.get(apiPre + 'entity/:entityId', entity.getEntity);

  app.get(apiPre + 'type/entity', type.getEntityTypes);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  app.get('/about', about.about);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};
