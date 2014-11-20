'use strict';

var _ = require('lodash');
var express = require('express');
var config = require('./../../config/config');
var utils = require('./../../utils');

/**
 * Get list of Water Planning Regions
 */
exports.getRegionList = function(req, res) {
  var filePath = config.dataPath + 'regions.json';
  utils.fileAsJsonResponse(res, filePath);
};

/**
 * Get TopoJSON of Water Planning Regions
 */
exports.getRegionTopoJson = function(req, res) {
  var filePath = config.dataPath + 'regions.topojson';
  utils.fileAsJsonResponse(res, filePath);
};

/**
 * Get list of Texas Counties
 */
exports.getCountyList = function(req, res) {
  var filePath = config.dataPath + 'counties.json';
  utils.fileAsJsonResponse(res, filePath);
};

/**
 * Get GeoJSON of single Texas County by name
 */
exports.getCountyGeoJsonByName = function(req, res) {
  req.check('name', 'Must be a valid county name')
    .notEmpty();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  var countyName = req.params.name.toUpperCase();
  var filePath = config.dataPath + 'counties.geojson';
  var countyGeoJson = utils.fileAsJson(filePath);

  var countyFeat = _.find(countyGeoJson.features, function(feat) {
    return countyName === feat.properties.COUNTY;
  });

  if (!countyFeat) {
    return res.json(404, {errors: 'Not Found'});
  }

  res.json(countyFeat);
};

/**
 * Get GeoJSON of all Texas Counties
 */
exports.getCountyGeoJson = function(req, res) {
  var filePath = config.dataPath + 'counties.geojson';
  utils.fileAsJsonResponse(res, filePath);
};

/**
 * Expose a router object
 */
var router = express.Router();
router.get('/regions', exports.getRegionList);
router.get('/regions.topojson', exports.getRegionTopoJson);
router.get('/county/:name.geojson', exports.getCountyGeoJsonByName);
router.get('/counties', exports.getCountyList);
router.get('/counties.geojson', exports.getCountyGeoJson);

exports.router = router;
