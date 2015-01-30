'use strict';

require('sugar');

var _ = require('lodash');
var express = require('express');
var db = require('./../../db');
var config = require('./../../config/config');
var validators = require('./../../lib/validators');

function selectEntities() {
  return db.select('EntityId', 'EntityName', 'Latitude', 'Longitude')
    .from('vwMapEntityCoordinates');
}

exports.getEntities = function(req, res) {
  selectEntities()
    .then(function (result) {
      return res.json(result);
    });
};

exports.getEntity = function(req, res) {
  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  selectEntities()
    .where('EntityId', entityId)
    .then(function (result) {
      return res.json(_.first(result));
    });
};

exports.getEntitySummary = function(req, res) {
  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  db.select().from('vwMapEntitySummary')
    .where('EntityId', entityId)
    .limit(1)
    .then(function (result) {
      return res.json(_.first(result));
    });
};

exports.getEntityTypes = function(req, res) {
  res.json(config.entityTypes);
};

exports.getEntitiesByNamePartial = function(req, res) {
  req.checkQuery('name', 'Must be at least 3 letters long')
    .notEmpty()
    .len(3);

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.status(400).json({errors: errors});
  }

  var nameQuery = '%' + req.query.name + '%';
  var startsWithName = req.query.name + '%';

  selectEntities()
    .where('EntityName', 'like', nameQuery)
    .orderByRaw('CASE WHEN EntityName LIKE "' + startsWithName + '" THEN 1 ELSE 2 END')
    .limit(10)
    .then(function (results) {
      return res.json(results);
    });
};


/**
 * Expose a router object
 */
var router = express.Router();
router.get('/', exports.getEntities);
router.get('/search', exports.getEntitiesByNamePartial);
router.get('/:entityId', validators.validateEntityId, exports.getEntity);
router.get('/:entityId/summary', validators.validateEntityId, exports.getEntitySummary);
exports.router = router;
