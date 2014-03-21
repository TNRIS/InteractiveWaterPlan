'use strict';

require('sugar');
var sqlite3 = require('sqlite3'),
    utils = require('./../../utils'),
    config = require('./../../config/config');

var db = new sqlite3.Database(config.dbPath, sqlite3.OPEN_READONLY);

//TODO: Should we validate params against regions and county names?

exports.getAllNeeds = function(req, res) {
  var statement = 'SELECT EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060 ' +
    'FROM vwMapWugNeeds';

  utils.sqlAllAsJsonResponse(res, db, statement);
};


exports.getSummary = function(req, res) {
  var statement = 'SELECT REGION as WugRegion, DECADE, MUNICIPAL, IRRIGATION, ' +
    'MANUFACTURING, MINING, `STEAM-ELECTRIC` as STEAMELECTRIC, LIVESTOCK, TOTAL ' +
    'FROM vwMapWugNeedsA1 ORDER BY WugRegion';
  utils.sqlAllAsJsonResponse(res, db, statement);
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

  var statement = 'SELECT vwMapWugNeeds.EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060, ' +
    'NPD2010, NPD2020, NPD2030, NPD2040, NPD2050, NPD2060 ' +
    'FROM vwMapWugNeeds ' +
    'INNER JOIN vwMapEntityNeedsAsPctOfDemand ' +
    'ON vwMapWugNeeds.EntityId == vwMapEntityNeedsAsPctOfDemand.EntityId ' +
    'WHERE WugRegion == ? ORDER BY EntityName';

  utils.sqlAllAsJsonResponse(res, db, statement, [region]);
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

  var statement = 'SELECT vwMapWugNeeds.EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060, ' +
    'NPD2010, NPD2020, NPD2030, NPD2040, NPD2050, NPD2060 ' +
    'FROM vwMapWugNeeds ' +
    'INNER JOIN vwMapEntityNeedsAsPctOfDemand ' +
    'ON vwMapWugNeeds.EntityId == vwMapEntityNeedsAsPctOfDemand.EntityId ' +
    'WHERE WugCounty == ? ORDER BY EntityName';

  utils.sqlAllAsJsonResponse(res, db, statement, [county]);
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

  var statement = 'SELECT vwMapWugNeeds.EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060, ' +
    'NPD2010, NPD2020, NPD2030, NPD2040, NPD2050, NPD2060 ' +
    'FROM vwMapWugNeeds ' +
    'INNER JOIN vwMapEntityNeedsAsPctOfDemand ' +
    'ON vwMapWugNeeds.EntityId == vwMapEntityNeedsAsPctOfDemand.EntityId ' +
    'WHERE WugType == ? ORDER BY EntityName';

  utils.sqlAllAsJsonResponse(res, db, statement, [entityType]);
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

  var statement = 'SELECT vwMapWugNeeds.EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060, ' +
    'NPD2010, NPD2020, NPD2030, NPD2040, NPD2050, NPD2060 ' +
    'FROM vwMapWugNeeds ' +
    'INNER JOIN vwMapEntityNeedsAsPctOfDemand ' +
    'ON vwMapWugNeeds.EntityId == vwMapEntityNeedsAsPctOfDemand.EntityId ' +
    'WHERE vwMapWugNeeds.EntityId == ? ORDER BY EntityName';

  utils.sqlAllAsJsonResponse(res, db, statement, [entityId]);
};

