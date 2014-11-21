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
    .from('vwMapWugNeedsA1')
    .orderBy('WugRegion')
    .then(utils.asJsonOrCsv(req, res));
};

function selectNeeds() {
  return db.select('vwMapWugNeeds.EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'N2010', 'N2020', 'N2030', 'N2040', 'N2050', 'N2060',
    'NPD2010', 'NPD2020', 'NPD2030', 'NPD2040', 'NPD2050', 'NPD2060')
    .from('vwMapWugNeeds')
    //We also need to join with the percent-of-demand view
    .innerJoin('vwMapEntityNeedsAsPctOfDemand',
      'vwMapWugNeeds.EntityId', 'vwMapEntityNeedsAsPctOfDemand.EntityId');
}

exports.getAllNeeds = function(req, res) {
  db.select('EntityId', 'EntityName', 'WugType', 'WugRegion', 'WugCounty',
    'N2010', 'N2020', 'N2030', 'N2040', 'N2050', 'N2060')
    .from('vwMapWugNeeds')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getNeedsForRegion = function(req, res) {
 var region = req.params.region;
  region = region.toUpperCase();

  selectNeeds()
    .where('WugRegion', region)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getNeedsForCounty = function(req, res) {
  var county = req.params.county;
  county = county.toUpperCase();

  selectNeeds()
    .where('WugCounty', county)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getNeedsForEntityType = function(req, res) {
  var entityType = req.params.entityType;
  entityType = entityType.toUpperCase();

  selectNeeds()
    .where('WugType', entityType)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getNeedsForEntity = function(req, res) {
  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  selectNeeds()
    .where('vwMapWugNeeds.EntityId', entityId)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};


/**
 * Expose a router object
 */
var router = express.Router();
router.get('/', exports.getAllNeeds);
router.get('/summary', exports.getRegionSummary);
router.get('/region/:region', validators.validateRegion, exports.getNeedsForRegion);
router.get('/county/:county', validators.validateCounty, exports.getNeedsForCounty);
router.get('/entity/:entityId', validators.validateEntityId, exports.getNeedsForEntity);
router.get('/type/:entityType', validators.validateEntityType, exports.getNeedsForEntityType);
exports.router = router;
