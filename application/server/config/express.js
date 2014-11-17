'use strict';

var express = require('express'),
    path = require('path'),
    validator = require('express-validator'),
    config = require('./config');

//Add .csv method to response objects
require('../lib/csv-response')(express);

/**
 * Express configuration
 */
module.exports = function(app) {

  switch (app.settings.env) {
    case 'production':
      app.locals({
        gaTrackingCode: 'UA-491601-10'
      });

      // app.use(express.compress());
      app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
      app.use(express.static(path.join(config.root, 'public')));
      break;

    default: //i.e., development
      app.locals({
        gaTrackingCode: ''
      });

      // Disable caching of scripts for easier testing
      app.use(function noCache(req, res, next) {
        if (req.url.indexOf('/scripts/') === 0) {
          res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.header('Pragma', 'no-cache');
          res.header('Expires', 0);
        }
        next();
      });

      app.use(express.static(path.join(config.root, '.tmp')));
      app.use(express.static(path.join(config.root, 'public')));
      break;
  }

  app.engine('html', require('swig').renderFile);
  app.set('view engine', 'html');

  app.set('views', config.root + '/server/views');

  app.disable('x-powered-by');
  app.use(express.logger('dev'));
  // app.use(express.bodyParser());
  // app.use(express.methodOverride());
  app.use(validator());

  // Router (only error handlers should come after this)
  app.use(app.router);

  if (app.settings.env !== 'production') {
    app.use(express.errorHandler());
  }
};
