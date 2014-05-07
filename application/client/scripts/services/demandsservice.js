'use strict';

angular.module('iswpApp')
  .factory('DemandsService', function DemandsService($http, API_PATH) {
    var service = {};

    var currentData = [];

    service.getCurrent = function() {
      return currentData;
    };

    service.fetch = function(type, typeId) {

      if (_.isEmpty(typeId)) {
        typeId = "";
      }

      var requestPath =  '{API_PATH}demands/{type}/{typeId}'.assign({
        API_PATH: API_PATH,
        type: type,
        typeId: typeId
      });

      var prom = $http.get(requestPath, {cache: true})
        .then(function(resp) {
          currentData = resp.data;
          return currentData;
        });

      return prom;
    };

    service.getSumsByEntityId = function(year) {
      if (!currentData || currentData.length === 0) {
        return null;
      }

      return _(currentData).groupBy('EntityId').map(function (rows, entityId) {
        var sumForProp = _.reduce(rows, function(sum, curr) {
          return sum + curr['D' + year];
        }, 0);

        return {
          'EntityId': entityId,
          'sum': sumForProp
        };
      }).value();
    };

    return service;
  });
