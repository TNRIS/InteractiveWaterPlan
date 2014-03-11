'use strict';

require('sugar');
var fs = require('fs'),
    sqlite3 = require('sqlite3'),
    Q = require('q'),
    _ = require('lodash'),
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
  var statement = 'SELECT REGION, DECADE, MUNICIPAL, IRRIGATION, ' +
    'MANUFACTURING, MINING, `STEAM-ELECTRIC`, LIVESTOCK, TOTAL ' +
    'FROM vwMapWugNeedsA1';
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

  var statement = 'SELECT EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060 ' +
    'FROM vwMapWugNeeds WHERE WugRegion == ?';

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

  var statement = 'SELECT EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060 ' +
    'FROM vwMapWugNeeds WHERE WugCounty == ?';

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

  var statement = 'SELECT EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060 ' +
    'FROM vwMapWugNeeds WHERE WugType == ?';

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

  var statement = 'SELECT EntityId, EntityName, WugType, WugRegion, ' +
    'WugRegion, WugCounty, N2010, N2020, N2030, N2040, N2050, N2060 ' +
    'FROM vwMapWugNeeds WHERE EntityId == ?';

  utils.sqlAllAsJsonResponse(res, db, statement, [entityId]);
};
