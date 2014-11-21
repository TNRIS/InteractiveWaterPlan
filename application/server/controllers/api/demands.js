'use strict';

require('sugar');

var express = require('express');
var db = require('./../../db');
var utils = require('./../../utils');

var viewName = 'vwMapWugDemand';

//The source db has 'EntityId' formatted as entityID for the demands
// data so we need to select it as `EntityId` in each SQL statement

exports.getAllDemands = function(req, res) {
  db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'D2010', 'D2020', 'D2030', 'D2040', 'D2050', 'D2060')
    .from(viewName)
    .then(utils.asJsonOrCsv(req, res));
};

exports.getRegionSummary = function(req, res) {
  db.select('REGION as WugRegion', 'DECADE', 'MUNICIPAL', 'IRRIGATION',
    'MANUFACTURING', 'MINING', 'STEAM-ELECTRIC as STEAMELECTRIC', 'LIVESTOCK',
    'TOTAL')
    .from('vwMapWugDemandsA1')
    .orderBy('WugRegion')
    .then(utils.asJsonOrCsv(req, res));
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

  db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'D2010', 'D2020', 'D2030', 'D2040', 'D2050', 'D2060')
    .from(viewName)
    .where('WugRegion', region)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
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

  db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'D2010', 'D2020', 'D2030', 'D2040', 'D2050', 'D2060')
    .from(viewName)
    .where('WugCounty', county)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
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

  db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'D2010', 'D2020', 'D2030', 'D2040', 'D2050', 'D2060')
    .from(viewName)
    .where('WugType', entityType)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
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

  db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'D2010', 'D2020', 'D2030', 'D2040', 'D2050', 'D2060')
    .from(viewName)
    .where('EntityId', entityId)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
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
