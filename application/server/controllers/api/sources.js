'use strict';

var express = require('express');
var merge = require('geojson-merge');
var db = require('./../../db');
var validators = require('./../../lib/validators');

function selectSources() {
  return db.select('sourceId', 'type', 'geojson')
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


// Get a GeoJSON FeatureCollection of all the source features
// identified in the array of sourceIds
exports.getSourcesByIds = function getSourcesByIds(req, res) {
  var sourceIds = req.query.ids;

  sourceIds = sourceIds.split(',').map(function (v) {
    return parseInt(v, 10);
  });

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


var router = express.Router();
router.get('/:sourceId', validators.validateSourceId, exports.getSourcesById);
router.get('/', validators.validateSourceIds, exports.getSourcesByIds);
exports.router = router;
