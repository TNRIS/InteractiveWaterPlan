'use strict';

require('sugar');

var express = require('express');
var db = require('./../../db');
var utils = require('./../../utils');

var viewName = 'vwMapWugNeeds';

exports.getAllNeeds = function(req, res) {
  db.select('EntityId', 'EntityName', 'WugType', 'WugRegion', 'WugCounty',
    'N2010', 'N2020', 'N2030', 'N2040', 'N2050', 'N2060')
    .from(viewName)
    .then(utils.asJsonOrCsv(req, res));
};


exports.getRegionSummary = function(req, res) {
  db.select('REGION as WugRegion', 'DECADE', 'MUNICIPAL', 'IRRIGATION',
    'MANUFACTURING', 'MINING', 'STEAM-ELECTRIC as STEAMELECTRIC', 'LIVESTOCK',
    'TOTAL')
    .from('vwMapWugNeedsA1')
    .orderBy('WugRegion')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getNeedsForRegion = function(req, res) {
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

  db.select('vwMapWugNeeds.EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'N2010', 'N2020', 'N2030', 'N2040', 'N2050', 'N2060',
    'NPD2010', 'NPD2020', 'NPD2030', 'NPD2040', 'NPD2050', 'NPD2060')
    .from(viewName)
    .innerJoin('vwMapEntityNeedsAsPctOfDemand', 'vwMapWugNeeds.EntityId', 'vwMapEntityNeedsAsPctOfDemand.EntityId')
    .where('WugRegion', region)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getNeedsForCounty = function(req, res) {
  req.check('county', 'Must be a valid county name')
    .notEmpty();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  var county = req.params.county;
  county = county.toUpperCase();

  db.select('vwMapWugNeeds.EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'N2010', 'N2020', 'N2030', 'N2040', 'N2050', 'N2060',
    'NPD2010', 'NPD2020', 'NPD2030', 'NPD2040', 'NPD2050', 'NPD2060')
    .from(viewName)
    .innerJoin('vwMapEntityNeedsAsPctOfDemand', 'vwMapWugNeeds.EntityId', 'vwMapEntityNeedsAsPctOfDemand.EntityId')
    .where('WugCounty', county)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getNeedsForEntityType = function(req, res) {
  req.check('entityType', 'Must be a valid Water User Group Entity Type')
    .notEmpty();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  var entityType = req.params.entityType;
  entityType = entityType.toUpperCase();

  db.select('vwMapWugNeeds.EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'N2010', 'N2020', 'N2030', 'N2040', 'N2050', 'N2060',
    'NPD2010', 'NPD2020', 'NPD2030', 'NPD2040', 'NPD2050', 'NPD2060')
    .from(viewName)
    .innerJoin('vwMapEntityNeedsAsPctOfDemand', 'vwMapWugNeeds.EntityId', 'vwMapEntityNeedsAsPctOfDemand.EntityId')
    .where('WugType', entityType)
    .orderBy('EntityName')
    .then(utils.asJsonOrCsv(req, res));
};

exports.getNeedsForEntity = function(req, res) {
  req.check('entityId', 'Must be a valid Water User Group Entity ID')
    .notEmpty()
    .isInt();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  db.select('vwMapWugNeeds.EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'N2010', 'N2020', 'N2030', 'N2040', 'N2050', 'N2060',
    'NPD2010', 'NPD2020', 'NPD2030', 'NPD2040', 'NPD2050', 'NPD2060')
    .from(viewName)
    .innerJoin('vwMapEntityNeedsAsPctOfDemand', 'vwMapWugNeeds.EntityId', 'vwMapEntityNeedsAsPctOfDemand.EntityId')
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
router.get('/region/:region', exports.getNeedsForRegion);
router.get('/county/:county', exports.getNeedsForCounty);
router.get('/entity/:entityId', exports.getNeedsForEntity);
router.get('/type/:entityType', exports.getNeedsForEntityType);
exports.router = router;
