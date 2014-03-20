'use strict';

var config = require('./../../config/config'),
    utils = require('./../../utils');


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

//TODO: getCountyGeoJson (all, and by name)