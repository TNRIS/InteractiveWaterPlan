'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

require('express-csv');

var jsonResponse = _.curry(function(res, err, data) {
  if (err) { throw err; }
  res.json(JSON.parse(data));
});

var readFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf8'}, callback);
};

exports.isCsv = function(req) {
  return ".csv" === path.extname(req.route.path).toLowerCase();
};

exports.fileAsJson = function(path) {
  var contents = fs.readFileSync(path, {encoding: 'utf8'});
  return JSON.parse(contents);
};

exports.fileAsJsonResponse = function(res, filePath) {
  readFile(filePath, jsonResponse(res));
};

exports.sqlAllAsCsvResponse = function(res, db, statement, params) {
  db.all(statement, params, function(err, rows) {
    if (err) { throw err; }
    res.csv(rows);
  });
};

exports.sqlAllAsJsonResponse = function(res, db, statement, params) {
  db.all(statement, params, function(err, rows) {
    if (err) { throw err; }
    res.json(rows);
  });
};

exports.sqlOneAsJsonResponse = function(res, db, statement, params) {
  db.get(statement, params, function(err, row) {
    if (err) { throw err; }
    res.json(row);
  });
};
