'use strict';

var _ = require('lodash');

function isCsv(req) {
  return (req.query.format &&
    req.query.format.toLowerCase() === "csv");
}

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
