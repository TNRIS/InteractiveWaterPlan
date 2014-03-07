'use strict';

var config = require('./../../config/config'),
    sqlite3 = require('sqlite3'),
    utils = require('./../../utils');

var db = new sqlite3.Database(config.dbPath);

//TODO: Should we validate params against regions and county names?

exports.getAllNeeds = function(req, res) {
  var statement = 'SELECT * FROM vwMapWugNeeds';
  utils.sqlAllAsJson(res, db, statement);
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

  var statement = 'SELECT * FROM vwMapWugNeeds WHERE WugRegion == ?';
  utils.sqlAllAsJson(res, db, statement, [region]);
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

  var statement = 'SELECT * FROM vwMapWugNeeds WHERE WugCounty == ?';
  utils.sqlAllAsJson(res, db, statement, [county]);
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

  var statement = 'SELECT * FROM vwMapWugNeeds WHERE EntityId == ?';
  utils.sqlAllAsJson(res, db, statement, [entityId]);
};
