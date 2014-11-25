'use strict';

var path = require('path');
var bluebird = require('bluebird');
var config = require('./../config/config');
var places = require('./api/places');

/**
 * Send template, or 404 if it doesn't exist
 */
exports.templates = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if(err) {
      console.log("Error retrieving template '" + requestedView + "'\n", err);
      res.status(404);
      res.send(404);
    } else {
      res.send(html);
    }
  });
};

/**
 * Send our single page app
 */
exports.index = function(req, res) {

  bluebird.all([
    places.selectRegionLetters(),
    places.selectCountyNames(),
    places.selectRegionsTopoJson()
  ]).then(function (results) {
    var regions = results[0];
    var counties = results[1];
    var regionsTopo = results[2];

    res.render('index', {
      pageName: 'home',
      ISWP_VARS: JSON.stringify({
        regions: regions,
        counties: counties,
        regionsTopo: regionsTopo,
        years: config.years,
        entityTypes: config.entityTypes
      })
    });
  });
};
