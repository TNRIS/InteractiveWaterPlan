'use strict';

var config = require('./../../config/config'),
    sqlite3 = require('sqlite3'),
    utils = require('./../../utils');

var db = new sqlite3.Database(config.dbPath, sqlite3.OPEN_READONLY);

exports.getEntities = function(req, res) {
  var statement = 'SELECT EntityId, EntityName, Latitude, Longitude ' +
    'FROM EntityCoordinates';
  utils.sqlAllAsJsonResponse(res, db, statement);
};

exports.getEntity = function(req, res) {
  req.check('entityId', 'Must be a valid Water User Group Entity ID')
    .notEmpty()
    .isInt();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  req.sanitize('entityId').toInt();
  var entityId = req.params.entityId;

  var statement = 'SELECT EntityId, EntityName, Latitude, Longitude ' +
    'FROM EntityCoordinates WHERE EntityId = ?';

  utils.sqlOneAsJsonResponse(res, db, statement, [entityId]);
};

exports.getEntityTypes = function(req, res) {
  var filePath = config.dataPath + 'entityTypes.json';
  utils.fileAsJsonResponse(res, filePath);
};

exports.getEntitiesByNamePartial = function(req, res) {
  req.checkQuery('name', 'Must be at least 3 letters long')
    .notEmpty()
    .len(3);

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.json(400, {errors: errors});
  }

  var nameQuery = req.query.name;

  var statement = 'SELECT EntityId, EntityName ' +
    'FROM EntityCoordinates ' +
    'WHERE EntityName LIKE $contains ' +
    'ORDER BY '  +
    '  CASE WHEN EntityName LIKE $startsWith THEN 1 ELSE 2 END ' +
    'LIMIT 10';

  var params = {
    $contains: '%' + nameQuery + '%',
    $startsWith: nameQuery + '%'
  };

  utils.sqlAllAsJsonResponse(res, db, statement, params);
};
