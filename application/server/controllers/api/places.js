'use strict';

var _ = require('lodash');
var express = require('express');
var topojson = require('topojson');
var utils = require('./../../utils');
var db = require('./../../db');
var validators = require('./../../lib/validators');

/**
 * Get list of Water Planning Regions
 */
function selectRegionLetters() {
  return db.select('LETTER').from('regions').orderBy('LETTER')
    .then(function (results) {
      return _.pluck(results, 'LETTER');
    });
}
exports.selectRegionLetters = selectRegionLetters;

exports.getRegionList = function(req, res) {
  selectRegionLetters().then(function (regionLetters) {
    res.json(regionLetters);
  });
};

/**
 * Get TopoJSON of Water Planning Regions
 */
function selectRegionsTopoJson() {
  return db.select().from('regions')
    .then(function (results) {
      var regionFeatures = results.reduce(function (featureCollection, r) {
        var feat = JSON.parse(r.geojson);
        feat.properties.region = r.LETTER;
        featureCollection.features.push(feat);
        return featureCollection;
      }, {type: 'FeatureCollection', features: []});

      var regionTopo = topojson.topology({collection: regionFeatures}, {
        'property-transform': function (f) { return f.properties; }
      });

      return regionTopo;
    });
}
exports.selectRegionsTopoJson = selectRegionsTopoJson;

exports.getRegionTopoJson = function(req, res) {
  selectRegionsTopoJson().then(function (regionTopo) {
    res.json(regionTopo);
  });
};

/**
 * Get list of Texas Counties
 */
function selectCountyNames() {
  return db.select('COUNTY').from('counties').orderBy('COUNTY')
    .then(function (results) {
      return _.pluck(results, 'COUNTY');
    });
}
exports.selectCountyNames = selectCountyNames;

exports.getCountyList = function(req, res) {
  selectCountyNames().then(function (countyNames) {
    res.json(countyNames);
  });
};

/**
 * Get GeoJSON of all Texas Counties
 */
function selectCountiesGeoJson() {
  return db.select('geojson', 'FIPS_NBR', 'COUNTY')
    .from('counties')
    .orderBy('COUNTY')
    .then(function (results) {
      return results.reduce(function (featureCollection, r) {
        var feat = JSON.parse(r.geojson);
        feat.properties = _.omit(r, 'geojson');
        featureCollection.features.push(feat);
        return featureCollection;
      }, {type: 'FeatureCollection', features: []});
    });
}

exports.getCountyGeoJson = function(req, res) {
  selectCountiesGeoJson().then(function (results) {
    res.json(results);
  });
};

/**
 * Get GeoJSON of single Texas County by name
 */
function selectCountyGeoJson(countyName) {
  if (_.isEmpty(countyName)) {
    throw new Error("countyName cannot be empty");
  }

  return db.select('geojson', 'FIPS_NBR', 'COUNTY')
    .from('counties')
    .where('COUNTY', countyName)
    .limit(1)
    .then(function (result) {
      result = _.first(result);

      if (!result) {
        return null;
      }

      var countyFeature = JSON.parse(result.geojson);
      countyFeature.properties = _.omit(result, 'geojson');
      return countyFeature;
    });

}

exports.getCountyGeoJsonByName = function(req, res) {
  var countyName = req.params.county.toUpperCase();

  selectCountyGeoJson(countyName).then(function (countyFeat) {
    if (!countyFeat) {
      return res.status(400).json({errors: 'Not found'});
    }

    res.json(countyFeat);
  });
};

exports.getStrategySources = function(req, res) {
  db.distinct('SourceName', 'MapSourceId')
    .from('vwMapWugWms')
    .orderBy('SourceName')
    .then(utils.asJsonOrCsv(req, res));
  };


/**
 * Expose a router object
 */
var router = express.Router();
router.get('/regions', exports.getRegionList);
router.get('/regions.topojson', exports.getRegionTopoJson);
router.get('/county/:county.geojson', validators.validateCounty, exports.getCountyGeoJsonByName);
router.get('/counties', exports.getCountyList);
router.get('/counties.geojson', exports.getCountyGeoJson);
router.get('/sources/strategy', exports.getStrategySources);

exports.router = router;
