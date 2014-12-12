'use strict';

require('sugar');

var _ = require('lodash');
var express = require('express');
var db = require('./../../db');
var utils = require('./../../utils');
var validators = require('./../../lib/validators');

exports.getRegionSummary = function getRegionSummary(req, res) {
  db.select('REGION as WugRegion', 'DECADE', 'MUNICIPAL', 'IRRIGATION',
    'MANUFACTURING', 'MINING', 'STEAM-ELECTRIC as STEAMELECTRIC', 'LIVESTOCK',
    'TOTAL')
    .from('vwMapWugExistingSupplyA1')
    .orderBy('WugRegion')
    .then(utils.asJsonOrCsv(req, res));
};

function selectSupplies() {
   return db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'MapSourceId', 'SourceName',
    'WS2010', 'WS2020', 'WS2030', 'WS2040', 'WS2050', 'WS2060')
    .from('vwMapExistingWugSupply');
}


var filterZeroValues = utils.makeZeroValueFilter('WS');

exports.getAllSupplies = function getAllSupplies(req, res) {
  selectSupplies()
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getSuppliesForRegion = function getSuppliesForRegion(req, res) {
  var region = req.params.region;
  region = region.toUpperCase();

  selectSupplies()
    .where('WugRegion', region)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getSuppliesForCounty = function getSuppliesForCounty(req, res) {
  var county = req.params.county;
  county = county.toUpperCase();

  selectSupplies()
    .where('WugCounty', county)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getSuppliesForEntity = function getSuppliesForEntity(req, res) {
  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  selectSupplies()
    .where('EntityId', entityId)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getSuppliesForEntityType = function getSuppliesForEntityType(req, res) {
  var entityType = req.params.entityType;
  entityType = entityType.toUpperCase();

  selectSupplies()
    .where('WugType', entityType)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
  };

exports.getSuppliesForSource = function getSuppliesForSource(req, res) {
  req.sanitize('sourceId').toInt();
  var sourceId = req.params.sourceId;

  selectSupplies()
    .where('MapSourceId', sourceId)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

var router = express.Router();
router.get('/', exports.getAllSupplies);
router.get('/summary', exports.getRegionSummary);
router.get('/region/:region', validators.validateRegion, exports.getSuppliesForRegion);
router.get('/county/:county', validators.validateCounty, exports.getSuppliesForCounty);
router.get('/entity/:entityId', validators.validateEntityId, exports.getSuppliesForEntity);
router.get('/type/:entityType', validators.validateEntityType, exports.getSuppliesForEntityType);
router.get('/source/:sourceId', validators.validateSourceId, exports.getSuppliesForSource);
exports.router = router;
