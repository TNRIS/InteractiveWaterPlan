'use strict';

require('sugar');

var db = require('./../../db');
var utils = require('./../../utils');

exports.getAllStrategies = function (req, res) {
  var statement = 'SELECT EntityId as `EntityId`, EntityName, WugType, ' +
    'WugRegion, WugCounty, SS2010, SS2020, SS2030, SS2040, SS2050, SS2060, ' +
    'MapSourceId, SourceName, StrategyName ' +
    'FROM vwMapWugWms';

  utils.csvOrJsonSqlAll(req, res, db, statement);
};
