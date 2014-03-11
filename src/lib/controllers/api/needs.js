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

  var promises = [],
      years = ['2010', '2020', '2030', '2040', '2050'];

  var regions = utils.fileAsJson(config.dataPath + 'regions.json');

  var getNeedsStatement = function(year, region) {
    var tpl = "SELECT WugType as 'type', SUM(N{year}) as 'total' " +
      "FROM vwMapWugNeeds WHERE WugRegion=='{region}' " +
      "GROUP BY WugType";

    return tpl.assign({region: region, year: year});
  };

  _.each(years, function(year) {
    _.each(regions, function(region) {
      var stmnt = getNeedsStatement(year, region),
          deferred = Q.defer();

      db.all(stmnt, {}, function(err, rows) {
        deferred.resolve({
          region: region,
          year: year,
          needs: rows
        });
      });

      promises.push(deferred.promise);
    });
  });

  Q.all(promises)
    .then(function(data) {
      res.json(data);
    });
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
