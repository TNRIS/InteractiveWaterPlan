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
    .from('vwMapWugWmsA1')
    .orderBy('WugRegion')
    .then(utils.asJsonOrCsv(req, res));
};


//TODO: StrategyType
function selectStrategies() {
  return db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'MapSourceId', 'SourceName', 'StrategyName',
    'SS2010', 'SS2020', 'SS2030', 'SS2040', 'SS2050', 'SS2060')
    .from('vwMapWugWms');
}

var filterZeroValues = utils.makeZeroValueFilter('SS');

exports.getAllStrategies = function getAllStrategies(req, res) {
  selectStrategies()
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getStrategiesForRegion = function getStrategiesForRegion(req, res) {
  var region = req.params.region;
  region = region.toUpperCase();

  selectStrategies()
    .where('WugRegion', region)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getStrategiesForCounty = function getStrategiesForCounty(req, res) {
  var county = req.params.county;
  county = county.toUpperCase();

  selectStrategies()
    .where('WugCounty', county)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getStrategiesForEntity = function getStrategiesForEntity(req, res) {
  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  selectStrategies()
    .where('EntityId', entityId)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getStrategiesForEntityType = function getStrategiesForEntityType(req, res) {
  var entityType = req.params.entityType;
  entityType = entityType.toUpperCase();

  selectStrategies()
    .where('WugType', entityType)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

exports.getStrategiesForSource = function getStrategiesForSource(req, res) {
  req.sanitize('sourceId').toInt();
  var sourceId = req.params.sourceId;

  selectStrategies()
    .where('MapSourceId', sourceId)
    .orderBy('EntityName')
    .then(_.compose(utils.asJsonOrCsv(req, res), filterZeroValues));
};

var router = express.Router();
router.get('/', exports.getAllStrategies);
router.get('/summary', exports.getRegionSummary);
router.get('/region/:region', validators.validateRegion, exports.getStrategiesForRegion);
router.get('/county/:county', validators.validateCounty, exports.getStrategiesForCounty);
router.get('/entity/:entityId', validators.validateEntityId, exports.getStrategiesForEntity);
router.get('/type/:entityType', validators.validateEntityType, exports.getStrategiesForEntityType);
router.get('/source/:sourceId', validators.validateSourceId, exports.getStrategiesForSource);
exports.router = router;

