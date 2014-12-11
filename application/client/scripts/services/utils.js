'use strict';

angular.module('iswpApp').factory('Utils', function (ENTITY_MIN_RADIUS, ENTITY_MAX_RADIUS) {
  var service = {};

  service.sumsByEntityId = function sumsByEntityId(data, year, valuePrefix) {
    if (!data || data.length === 0) {
      return null;
    }

    var results = {};

    _(data).groupBy('EntityId').each(function (rows, entityId) {
      var sumForProp = _.reduce(rows, function(sum, row) {
        var val = row['' + valuePrefix + year];
        if (angular.isDefined(val) && val > 0) {
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

  return service;
});
