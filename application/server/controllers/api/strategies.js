'use strict';

require('sugar');

var express = require('express');
var db = require('./../../db');
var utils = require('./../../utils');

exports.getAllStrategies = function (req, res) {
  db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
    'WugCounty', 'MapSourceId', 'SourceName', 'StrategyName',
    'SS2010', 'SS2020', 'SS2030', 'SS2040', 'SS2050', 'SS2060')
    .from('vwMapWugWms')
    .then(utils.asJsonOrCsv(req, res));
};

var router = express.Router();
router.get('/', exports.getAllStrategies);

exports.router = router;

