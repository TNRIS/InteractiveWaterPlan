'use strict';

var express = require('express');
var merge = require('geojson-merge');
var db = require('./../../db');
var validators = require('./../../lib/validators');

function selectSources() {
  return db.select('id', 'type', 'geojson')
    .from('SourceFeatures');
}

function toSourceFeatureCollection(sourceResults) {

  if (!sourceResults || sourceResults.length === 0) {
    return null;
  }

  var gjs = sourceResults.map(function (sourceResult) {
    var gj = JSON.parse(sourceResult.geojson);
    gj.properties.sourceId = sourceResult.id;
    gj.properties.sourceType = sourceResult.type;
    return gj;
  });

  return merge(gjs);
}

// Get a GeoJSON FeatureCollection of all the source features
// identified by the sourceId param
exports.getSourcesById = function getSourcesById(req, res) {
  var sourceId = req.params.sourceId;

  selectSources()
    .where('id', sourceId)
    .then(function (result) {
      var fc = toSourceFeatureCollection(result);
      if (!fc) {
        return res.status(400).json({error: 'Not found'});
      }

      res.json(fc);
    });
};


function toIntArr(str) {
  return str.split(',').map(function (v) {
    return parseInt(v, 10);
  });
}

// Get a GeoJSON FeatureCollection of all the source features
// identified in the array of sourceIds
exports.getSourcesByIds = function getSourcesByIds(req, res) {
  var sourceIds = req.query.ids;

  sourceIds = toIntArr(sourceIds);

  selectSources()
    .whereIn('id', sourceIds)
    .then(function (result) {
      var fc = toSourceFeatureCollection(result);
      if (!fc) {
        return res.status(400).json({error: 'Not found'});
      }

      res.json(fc);
    });
};

exports.getMappingPoints = function getMappingPoints(req, res) {
  var sourceIds = req.query.ids;

  sourceIds = toIntArr(sourceIds);

  return db.select('id', 'type', 'mappingPoint')
    .from('SourceFeatures')
    .whereIn('id', sourceIds)
    .then(function (results) {
      results = results.map(function (result) {
        var coords = result.mappingPoint.split(',').map(parseFloat);
        result.mappingPoint = {
          type: 'Point',
          coordinates: coords
        };
        return result;
      });

      res.json(results);
    });
};

exports.getStrategySourceList = function getStrategySourceList(req, res) {
  db.distinct('SourceName', 'MapSourceId')
    .from('vwMapWugWms')
    .orderBy('SourceName')
    .then(function (results) {
      return res.json(results);
    });
};



var router = express.Router();
router.get('/points', validators.validateSourceIds, exports.getMappingPoints);
router.get('/strategy', exports.getStrategySourceList);
router.get('/:sourceId', validators.validateSourceId, exports.getSourcesById);
router.get('/', validators.validateSourceIds, exports.getSourcesByIds);
exports.router = router;
