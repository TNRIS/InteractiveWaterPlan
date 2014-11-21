'use strict';

var fs = require('fs');
var _ = require('lodash');

var jsonResponse = _.curry(function(res, err, data) {
  if (err) { throw err; }
  res.json(JSON.parse(data));
});

function readFile(path, callback) {
  fs.readFile(path, {encoding: 'utf8'}, callback);
}

function isCsv(req) {
  return (req.query.format &&
    req.query.format.toLowerCase() === "csv");
}

exports.fileAsJson = function fileAsJson(path) {
  var contents = fs.readFileSync(path, {encoding: 'utf8'});
  return JSON.parse(contents);
};

exports.fileAsJsonResponse = function fileAsJsonResponse(res, filePath) {
  readFile(filePath, jsonResponse(res));
};

//used with knex queries to return json or csv response
//example: db.select.from().then(asJsonOrCsv(req,res))
exports.asJsonOrCsv = function asJsonOrCsv(req, res) {
  return function (queryResult) {
    if (isCsv(req)) {
      return res.csv(queryResult, {
        fields: _.keys(_.first(queryResult))
      });
    }
    //else
    return res.json(queryResult);
  };
};
