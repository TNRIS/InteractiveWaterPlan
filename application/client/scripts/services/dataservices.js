'use strict';

angular.module('iswpApp')
  .factory('DataServiceFactory', function ($http, Utils, DATA_VALUE_PREFIXES, API_PATH) {

    function createService (name) {
      var service = {};

      var currentData = [];

      service.getCurrent = function() {
        return currentData;
      };

      service.fetch = function(type, typeId) {
        if (_.isEmpty(typeId)) {
          typeId = "";
        }

        var requestPath =  '{API_PATH}{name}/{type}/{typeId}'.assign({
          API_PATH: API_PATH,
          name: name,
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
        var valueKey = DATA_VALUE_PREFIXES[name] + year;
        return Utils.sumsByEntityId(currentData, valueKey);
      };

      return service;
    }

    return {createService: createService};
  })
  .factory('DemandsService', function (DataServiceFactory) {
    return DataServiceFactory.createService('demands');
  })
  .factory('NeedsService', function (DataServiceFactory) {
    return DataServiceFactory.createService('needs');
  })
  .factory('StrategiesService', function (DataServiceFactory) {
    return DataServiceFactory.createService('strategies');
  })
  .factory('SuppliesService', function (DataServiceFactory) {
    return DataServiceFactory.createService('supplies');
  })
  ;
