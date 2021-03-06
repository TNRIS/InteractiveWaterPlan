'use strict';

var _ = require('lodash');
var JSet = require('Set');
var config = require('./config/config');

function isCsv(req) {
  return (req.query.format &&
    req.query.format.toLowerCase() === "csv");
}

//used with knex queries to return json or csv response
//example: db.select.from().then(asJsonOrCsv(req,res))
exports.asJsonOrCsv = function asJsonOrCsv(req, res) {
  return function (queryResult) {
    if (isCsv(req)) {
      var fieldSet = queryResult.reduce(function (currSet, r) {
        currSet.addAll(_.keys(r));
        return currSet;
      }, new JSet());
      var fields = fieldSet.toArray();
      return res.csv(queryResult, {
        fields: fields
      });
    }
    //else
    return res.json(queryResult);
  };
};


exports.makeZeroValueFilter = function makeZeroValueFilter(valueKeyPrefix) {
  if (!valueKeyPrefix) {
    throw new Error('Must provide valueKeyPrefix');
  }

  var years = config.years;
  var toValueKey = function (year) {
    return valueKeyPrefix + year;
  };

  var valueFields = _.zipObject(
    _.map(years, toValueKey),
    _.times(years.length, _.constant(true))
  );

  return function zeroValueFilter(results) {
    return _.map(results, function (row) {
      var shouldDisplayZero = row.DisplayZero && row.DisplayZero === 'Y';
      return _.omit(row, function (val, key) {
        return !!valueFields[key] && (val === 0 && !shouldDisplayZero);
      });
    });
  };
};
