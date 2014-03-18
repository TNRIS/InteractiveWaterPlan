'use strict';

var fs = require('fs'),
    _ = require('lodash');

var jsonResponse = _.curry(function(res, err, data) {
  if (err) { throw err; }
  res.json(JSON.parse(data));
});

var readFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf8'}, callback);
};

exports.fileAsJson = function(path) {
  var contents = fs.readFileSync(path, {encoding: 'utf8'});
  return JSON.parse(contents);
};

exports.fileAsJsonResponse = function(res, filePath) {
  readFile(filePath, jsonResponse(res));
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
