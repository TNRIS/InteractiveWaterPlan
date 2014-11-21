'use strict';

var sqlite3 = require('sqlite3');
var config = require('./config/config');

var db = new sqlite3.Database(config.dbPath, sqlite3.OPEN_READONLY);

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: config.dbPath
  }
});

db.knex = knex;
module.exports = exports = db;
// exports.knex = knex;
