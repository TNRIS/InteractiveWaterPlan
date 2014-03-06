'use strict';

var api = require('./controllers/api'),
about = require('./controllers/about'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  var apiPre = '/api/v1/';
  app.get(apiPre + 'awesomeThings', api.awesomeThings);
  app.get(apiPre + 'regions', api.regions);
  app.get(apiPre + 'counties', api.counties);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  app.get('/about', about.about);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};
