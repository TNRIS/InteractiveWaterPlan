'use strict';

require('sugar');

var _ = require('lodash');
var express = require('express');
var db = require('./../../db');
var utils = require('./../../utils');
var config = require('./../../config/config');

exports.getEntities = function(req, res) {
  db.select('EntityId', 'EntityName', 'Latitude', 'Longitude')
    .from('EntityCoordinates')
    .then(function (result) {
      return res.json(result);
    });
};

exports.getEntity = function(req, res) {
  req.check('entityId', 'Must be a valid Water User Group Entity ID')
    .notEmpty()
    .isInt();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  db.select('EntityId', 'EntityName', 'Latitude', 'Longitude')
    .from('EntityCoordinates')
    .where('EntityId', entityId)
    .then(function (result) {
      return res.json(_.first(result));
    });
};

exports.getEntitySummary = function(req, res) {
  req.check('entityId', 'Must be a valid Water User Group Entity ID')
    .notEmpty()
    .isInt();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

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
  var filePath = config.dataPath + 'entityTypes.json';
  utils.fileAsJsonResponse(res, filePath);
};

exports.getEntitiesByNamePartial = function(req, res) {
  req.checkQuery('name', 'Must be at least 3 letters long')
    .notEmpty()
    .len(3);

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  var nameQuery = '%' + req.query.name + '%';
  var startsWithName = req.query.name + '%';

  db.select('EntityId', 'EntityName')
    .from('EntityCoordinates')
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
router.get('/:entityId', exports.getEntity);
router.get('/:entityId/summary', exports.getEntitySummary);
exports.router = router;
