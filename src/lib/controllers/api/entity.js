'use strict';

var config = require('./../../config/config'),
    sqlite3 = require('sqlite3'),
    utils = require('./../../utils');

var db = new sqlite3.Database(config.dbPath);

exports.getEntities = function(req, res) {
  var statement = 'SELECT EntityId, EntityName, Latitude, Longitude ' +
    'FROM EntityCoordinates';
  utils.sqlAllAsJson(res, db, statement);
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

  utils.sqlOneAsJson(res, db, statement, [entityId]);
};

exports.getEntityTypes = function(req, res) {
  var filePath = config.dataPath + 'entityTypes.json';
  utils.fileAsJson(res, filePath);
};


