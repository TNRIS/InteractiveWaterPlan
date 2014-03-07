'use strict';

var places = require('./controllers/api/places'),
    needs = require('./controllers/api/needs'),
    about = require('./controllers/about'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  var apiPre = '/api/v1/';
  app.get(apiPre + 'regions', places.getRegionList);
  app.get(apiPre + 'counties', places.getCountyList);
  app.get(apiPre + 'regions.topojson', places.getRegionTopoJson);

  app.get(apiPre + 'needs', needs.getAllNeeds);
  app.get(apiPre + 'needs/region/:region', needs.getNeedsForRegion);
  app.get(apiPre + 'needs/county/:county', needs.getNeedsForCounty);
  app.get(apiPre + 'needs/entity/:entityId', needs.getNeedsForEntity);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  app.get('/about', about.about);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};
