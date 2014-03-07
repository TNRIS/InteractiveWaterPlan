'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  dataPath: rootPath + '/lib/data/',
  dbPath: rootPath + '/lib/cache/cache.db',
  port: process.env.PORT || 3000
};
