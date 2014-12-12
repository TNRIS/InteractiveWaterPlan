'use strict';

angular.module('iswpApp').factory('Utils', function (SUMMARY_TABLE_COLS, ENTITY_MIN_RADIUS, ENTITY_MAX_RADIUS) {
  var service = {};

  service.sumsByEntityId = function sumsByEntityId(data, valueKey) {
    if (!data || data.length === 0) {
      return null;
    }

    var results = {};

    _(data).groupBy('EntityId').each(function (rows, entityId) {

      var filteredRows = _.filter(rows, function (row) {
        return angular.isDefined(row[valueKey]);
      });

      if (!filteredRows.length) {
        return;
      }

      var sumForProp = _.reduce(filteredRows, function (sum, row) {
        var val = row[valueKey];
        //only include positive values in sum
        if (val > 0) {
          return sum + val;
        }
        return sum;
      }, 0);

      results[entityId] = sumForProp;
    });

    return results;
  };

  service.scaleRadius = function scaleRadius(max, min, val) {
    if (!angular.isNumber(max) || !angular.isNumber(min) || !angular.isNumber(val)) {
      throw new Error("max, min, and val must all be numbers");
    }

    if (max === min) {
      return ENTITY_MIN_RADIUS;
    }
    return (ENTITY_MAX_RADIUS - ENTITY_MIN_RADIUS) * (val - min) / (max - min) + ENTITY_MIN_RADIUS;
  };

  service.calculateSummaryTotals = function calculateSummaryTotals(dataForYear) {
    var sum = function (arr) {
        return _.reduce(arr, function (sum, num) {
          return sum + num;
        }, 0);
      };

    var valueFields = _(SUMMARY_TABLE_COLS).pluck('map')
      .without('WugRegion').value();

    var fieldSums = _(valueFields).map(function (field) {
        return sum(_.pluck(dataForYear, field));
      }).value();

    return fieldSums;
  };

  return service;
});
