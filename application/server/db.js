'use strict';

var config = require('./config/config');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: config.dbPath
  },
  debug: config.env !== 'production'
});

module.exports = knex;
