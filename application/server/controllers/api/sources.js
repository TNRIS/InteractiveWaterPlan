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


function selectStrategySources() {
  return db.distinct('SourceName', 'MapSourceId')
    .from('vwMapWugWms')
    .orderBy('SourceName');
}
exports.selectStrategySources = selectStrategySources;

exports.getStrategySourceList = function getStrategySourceList(req, res) {
  selectStrategySources()
    .then(function (results) {
      return res.json(results);
    });
};


function selectExistingSources() {
  return db.distinct('SourceName', 'MapSourceId')
    .from('vwMapExistingWugSupply')
    .orderBy('SourceName');
}
exports.selectExistingSources = selectExistingSources;

exports.getExistingSourceList = function getExistingSourceList(req, res) {
  selectExistingSources()
    .then(function (results) {
      return res.json(results);
    });
};



var router = express.Router();
router.get('/strategy', exports.getStrategySourceList);
router.get('/existing', exports.getExistingSourceList);
router.get('/:sourceId', validators.validateSourceId, exports.getSourcesById);
router.get('/', validators.validateSourceIds, exports.getSourcesByIds);
exports.router = router;
