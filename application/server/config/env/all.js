'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  dataPath: rootPath + '/server/data/',
  dbPath: rootPath + '/server/cache/cache.db',
  port: process.env.PORT || 3000
};
