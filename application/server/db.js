'use strict';

var sqlite3 = require('sqlite3');
var config = require('./config/config');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: config.dbPath
  },
  debug: config.env !== 'production'
});

module.exports = knex;
