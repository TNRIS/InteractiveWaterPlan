'use strict';

var path = require('path');
var config = require('./config/config');

var db = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.normalize(__dirname + '/cache/cache.db')
  },
  debug: config.env !== 'production'
});

module.exports = db;
