'use strict';

var config = require('./../../config/config'),
    utils = require('./../../utils');

exports.getEntityTypes = function(req, res) {
  var filePath = config.dataPath + 'entityTypes.json';
  utils.fileAsJson(res, filePath);
};


