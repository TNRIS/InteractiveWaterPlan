'use strict';

var express = require('express');
var config = require('./../../config/config');

exports.getEntityTypes = function(req, res) {
  res.json(config.entityTypes);
};


/**
 * Expose a router object
 */
var router = express.Router();
router.get('/entity', exports.getEntityTypes);
exports.router = router;
