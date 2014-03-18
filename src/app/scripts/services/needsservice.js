'use strict';

angular.module('iswpApp')
  .service('NeedsService', function NeedsService($http, API_PATH) {
    var service = {};

    var currentData = [];

    service.getCurrent = function() {
      return currentData;
    };

    service.fetch = function(type, typeId) {

      if (_.isEmpty(typeId)) {
        typeId = "";
      }

      var requestPath =  '{API_PATH}needs/{type}/{typeId}'.assign({
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

    service.getForEntity = function(entityId) {
      if (!currentData || currentData.length === 0) {
        return null;
      }

      return _.find(currentData, {'EntityId': entityId});
    };

    return service;
  });