'use strict';

var express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    validator = require('express-validator'),
    favicon = require('serve-favicon'),
    tryparse = require('tryparse'),
    config = require('./config');

//Add .csv method to response objects
require('../lib/csv-response')(express);

/**
 * Express configuration
 */
module.exports = function(app) {

  var env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
      app.use(express.static(path.join(config.root, 'public')));
      break;

    default: //i.e., development
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

  app.locals.gaTrackingCode = config.gaTrackingCode;

  //Use SWIG
  app.engine('html', require('swig').renderFile);
  app.set('view engine', 'html');

  app.set('views', config.root + '/server/views');

  app.disable('x-powered-by');
  app.use(morgan('combined')); //logging

  app.use(validator({
    customValidators: {
      isIntList: function isIntList(value) {
        var arr = value.split(',');
        return arr.all(function (v) {
          return tryparse.int(v);
        });
      }
    }
  }));
};
