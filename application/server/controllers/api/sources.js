'use strict';

var express = require('express');
var merge = require('geojson-merge');
var db = require('./../../db');
var validators = require('./../../lib/validators');

function selectSources() {
  return db.select('sourceId', 'type', 'geojson', 'mappingPoint')
    .from('SourceFeatures');
}

function toSourceFeatureCollection(sourceResults) {

  if (!sourceResults || sourceResults.length === 0) {
    return null;
  }

  var gjs = sourceResults.map(function (sourceResult) {
    var gj = JSON.parse(sourceResult.geojson);
    gj.properties.sourceId = sourceResult.sourceId;
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
    .where('sourceId', sourceId)
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
    .whereIn('sourceId', sourceIds)
    .then(function (result) {
      var fc = toSourceFeatureCollection(result);
      if (!fc) {
        return res.status(400).json({error: 'Not found'});
      }

      res.json(fc);
    });
};

exports.getSourceMappingPoints = function getSourceMappingPoints(req, res) {
  var sourceIds = req.query.ids;

  sourceIds = toIntArr(sourceIds);

  return db.select('sourceId', 'mappingPoint', 'geojson')
    .from('SourceFeatures')
    .whereIn('sourceId', sourceIds)
    .then(function (result) {
      res.json(result);
    });
};

var router = express.Router();
router.get('/points', validators.validateSourceIds, exports.getSourceMappingPoints);
router.get('/:sourceId', validators.validateSourceId, exports.getSourcesById);
router.get('/', validators.validateSourceIds, exports.getSourcesByIds);
exports.router = router;
