'use strict';

require('sugar');

var express = require('express');
var db = require('./../../db');
var utils = require('./../../utils');

//The source db has 'EntityId' formatted as entityID for the demands
// data so we need to select it as `EntityId` in each SQL statement

exports.getAllDemands = function(req, res) {
  var statement = 'SELECT EntityId as `EntityId`, EntityName, WugType, ' +
    'WugRegion, WugCounty, D2010, D2020, D2030, D2040, D2050, D2060 ' +
    'FROM vwMapWugDemand';

  utils.csvOrJsonSqlAll(req, res, db, statement);
};

exports.getRegionSummary = function(req, res) {
  var statement = 'SELECT REGION as WugRegion, DECADE, MUNICIPAL, IRRIGATION, ' +
    'MANUFACTURING, MINING, `STEAM-ELECTRIC` as STEAMELECTRIC, LIVESTOCK, TOTAL ' +
    'FROM vwMapWugDemandsA1 ORDER BY WugRegion';

  utils.csvOrJsonSqlAll(req, res, db, statement);
};

exports.getDemandsForRegion = function(req, res) {
  req.check('region', 'Must be a single letter')
    .notEmpty()
    .isAlpha()
    .len(1,1);

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  var region = req.params.region;
  region = region.toUpperCase();

  var statement = 'SELECT EntityId as `EntityId`, EntityName, WugType, ' +
    'WugRegion, WugCounty, D2010, D2020, D2030, D2040, D2050, D2060 ' +
    'FROM vwMapWugDemand ' +
    'WHERE WugRegion == ? ORDER BY EntityName';

  utils.csvOrJsonSqlAll(req, res, db, statement, [region]);
};

exports.getDemandsForCounty = function(req, res) {
  req.check('county', 'Must be a valid county name')
    .notEmpty();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  var county = req.params.county;
  county = county.toUpperCase();

  var statement = 'SELECT EntityId as `EntityId`, EntityName, WugType, ' +
    'WugRegion, WugCounty, D2010, D2020, D2030, D2040, D2050, D2060 ' +
    'FROM vwMapWugDemand ' +
    'WHERE WugCounty == ? ORDER BY EntityName';

  utils.csvOrJsonSqlAll(req, res, db, statement, [county]);
};

exports.getDemandsForEntityType = function(req, res) {
  req.check('entityType', 'Must be a valid Water User Group Entity Type')
    .notEmpty();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  var entityType = req.params.entityType;
  entityType = entityType.toUpperCase();

  var statement = 'SELECT EntityId as `EntityId`, EntityName, WugType, ' +
    'WugRegion, WugCounty, D2010, D2020, D2030, D2040, D2050, D2060 ' +
    'FROM vwMapWugDemand ' +
    'WHERE WugType == ? ORDER BY EntityName';

  utils.csvOrJsonSqlAll(req, res, db, statement, [entityType]);
};

exports.getDemandsForEntity = function(req, res) {
  req.check('entityId', 'Must be a valid Water User Group Entity ID')
    .notEmpty()
    .isInt();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  var statement = 'SELECT EntityId as `EntityId`, EntityName, WugType, ' +
    'WugRegion, WugCounty, D2010, D2020, D2030, D2040, D2050, D2060 ' +
    'FROM vwMapWugDemand ' +
    'WHERE EntityId == ? ORDER BY EntityName';

  utils.csvOrJsonSqlAll(req, res, db, statement, [entityId]);
};

/**
 * Expose a router object
 */
var router = express.Router();
router.get('/', exports.getAllDemands);
router.get('/summary', exports.getRegionSummary);
router.get('/region/:region', exports.getDemandsForRegion);
router.get('/county/:county', exports.getDemandsForCounty);
router.get('/entity/:entityId', exports.getDemandsForEntity);
router.get('/type/:entityType', exports.getDemandsForEntityType);
exports.router = router;
