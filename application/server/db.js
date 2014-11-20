'use strict';

var sqlite3 = require('sqlite3');
var config = require('./config/config');

var db = new sqlite3.Database(config.dbPath, sqlite3.OPEN_READONLY);

module.exports = exports = db;
