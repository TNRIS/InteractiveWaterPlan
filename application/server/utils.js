'use strict';

var fs = require('fs'),
    // path = require('path'),
    _ = require('lodash');

var jsonResponse = _.curry(function(res, err, data) {
  if (err) { throw err; }
  res.json(JSON.parse(data));
});

var readFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf8'}, callback);
};

exports.isCsv = function(req) {
  return (req.query.format &&
    req.query.format.toLowerCase() === "csv");
};

exports.fileAsJson = function(path) {
  var contents = fs.readFileSync(path, {encoding: 'utf8'});
  return JSON.parse(contents);
};

exports.fileAsJsonResponse = function(res, filePath) {
  readFile(filePath, jsonResponse(res));
};

exports.sqlAllAsCsvResponse = function(req, res, db, statement, params) {
  db.all(statement, params, function(err, rows) {
    if (err) { throw err; }
    //TODO: Option to add some descriptive text to the top of each
    // file (download date, units, where to find more info, etc)
    res.csv(rows, {
      //TODO: fileName: path.basename(req.route.path) + ".csv",
      fields: _.keys(_.first(rows))
    });
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

exports.csvOrJsonSqlAll = function(req, res, db, statement, params) {
  if (exports.isCsv(req)) {
    exports.sqlAllAsCsvResponse(req, res, db, statement, params);
  }
  else {
    exports.sqlAllAsJsonResponse(res, db, statement, params);
  }
};
