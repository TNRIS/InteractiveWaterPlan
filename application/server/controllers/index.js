'use strict';

var path = require('path');
var Bluebird = require('bluebird');
var config = require('./../config/config');
var places = require('./api/places');
var sources = require('./api/sources');
var strategies = require('./api/strategies');

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

  Bluebird.all([
    places.selectRegionLetters(),
    places.selectCountyNames(),
    places.selectRegionsTopoJson(),
    sources.selectStrategySources(),
    sources.selectExistingSources(),
    strategies.selectWmsTypes()
  ]).spread(function (regions, counties, regionsTopo, strategySources, existingSources, wmsTypes) {

    return res.render('index', {
      pageName: 'home',
      ISWP_VARS: JSON.stringify({
        regions: regions,
        counties: counties,
        regionsTopo: regionsTopo,
        years: config.years,
        entityTypes: config.entityTypes,
        strategySources: strategySources,
        existingSources: existingSources,
        wmsTypes: wmsTypes
      })
    });
  });
};
