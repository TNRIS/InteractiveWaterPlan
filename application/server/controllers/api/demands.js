'use strict';

require('sugar');

var express = require('express');
var db = require('./../../db');
var utils = require('./../../utils');
var validators = require('./../../lib/validators');

exports.getRegionSummary = function(req, res) {
  db.select('REGION as WugRegion', 'DECADE', 'MUNICIPAL', 'IRRIGATION',
    'MANUFACTURING', 'MINING', 'STEAM-ELECTRIC as STEAMELECTRIC', 'LIVESTOCK',
    'TOTAL')
    .from('vwMapWugDemandsA1')
    .orderBy('WugRegion')
    .then(utils.asJsonOrCsv(req, res));
};


//The source db has 'EntityId' formatted as entityID for the demands
// data so we need to select it as `EntityId` in each SQL statement
function selectDemands() {
  return db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'D2010', 'D2020', 'D2030', 'D2040', 'D2050', 'D2060')
    .from('vwMapWugDemand');
}

exports.getAllDemands = function(req, res) {
  selectDemands()
    .then(utils.asJsonOrCsv(req, res));
};


exports.getDemandsForRegion = function(req, res) {
  var region = req.params.region;
  region = region.toUpperCase();

  selectDemands()
    .where('WugRegion', region)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getDemandsForCounty = function(req, res) {
  var county = req.params.county;
  county = county.toUpperCase();

  selectDemands()
    .where('WugCounty', county)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getDemandsForEntityType = function(req, res) {
  var entityType = req.params.entityType;
  entityType = entityType.toUpperCase();

  selectDemands()
    .where('WugType', entityType)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getDemandsForEntity = function(req, res) {
  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  selectDemands()
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
router.get('/region/:region', validators.validateRegion, exports.getDemandsForRegion);
router.get('/county/:county', validators.validateCounty, exports.getDemandsForCounty);
router.get('/entity/:entityId', validators.validateEntityId, exports.getDemandsForEntity);
router.get('/type/:entityType', validators.validateEntityType, exports.getDemandsForEntityType);
exports.router = router;
