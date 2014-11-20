'use strict';

var express = require('express');
var config = require('./../../config/config');
var utils = require('./../../utils');

exports.getEntityTypes = function(req, res) {
  var filePath = config.dataPath + 'entityTypes.json';
  utils.fileAsJsonResponse(res, filePath);
};


/**
 * Expose a router object
 */
var router = express.Router();
router.get('/entity', exports.getEntityTypes);
exports.router = router;
