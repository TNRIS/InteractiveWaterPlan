'use strict';

var path = require('path'),
    config = require('./../config/config'),
    utils = require('./../utils');

/**
 * Send partial, or 404 if it doesn't exist
 */
exports.partials = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if(err) {
      console.log("Error rendering partial '" + requestedView + "'\n", err);
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
  //TODO: Consolidate these and the related API methods
  var regions = utils.fileAsJson(
    config.dataPath + 'regions.json'),

    counties = utils.fileAsJson(
      config.dataPath + 'counties.json'),

    regionsTopo = utils.fileAsJson(
      config.dataPath + 'regions.topojson'),

    years = ['2010', '2020', '2030', '2040', '2050', '2060'],

    entityTypes = utils.fileAsJson(
      config.dataPath + 'entityTypes.json');

  // res.render('index', {
  //   regions: JSON.stringify(regions),
  //   counties: JSON.stringify(counties),
  //   regionsTopo: JSON.stringify(regionsTopo),
  //   years: JSON.stringify(years)
  // });

  res.render('index', {
    ISWP_VARS: JSON.stringify({
      regions: regions,
      counties: counties,
      regionsTopo: regionsTopo,
      years: years,
      entityTypes: entityTypes
    })
  });
};
