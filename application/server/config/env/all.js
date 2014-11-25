'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  dbPath: rootPath + '/server/cache/cache.db',
  port: process.env.PORT || 3000,
  years: ['2010', '2020', '2030', '2040', '2050', '2060'],
  entityTypes: ['MUNICIPAL','IRRIGATION','LIVESTOCK','MANUFACTURING','MINING','STEAM-ELECTRIC'],
  gaTrackingCode: ''
};
