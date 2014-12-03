'use strict';

angular.module('iswpApp').factory('Utils', function (ENTITY_MIN_RADIUS, ENTITY_MAX_RADIUS) {
  var service = {};

  service.sumsByEntityId = function sumsByEntityId(data, year, valuePrefix) {
    if (!data || data.length === 0) {
      return null;
    }

    return _(data).groupBy('EntityId').map(function (rows, entityId) {
      var sumForProp = _.reduce(rows, function(sum, curr) {
        return sum + curr['' + valuePrefix + year];
      }, 0);

      return {
        'EntityId': entityId,
        'sum': sumForProp
      };
    }).value();
  };

  service.scaleRadius = function scaleRadius(max, min, val) {
    var scaledVal;
    var scaleMax = ENTITY_MAX_RADIUS;
    var scaleMin = ENTITY_MIN_RADIUS;
    if (max === min) {
      return scaleMin;
    }
    scaledVal = (scaleMax - scaleMin) * (val - min) / (max - min) + scaleMin;
    return scaledVal;
  };

  return service;
});
