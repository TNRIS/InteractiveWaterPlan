'use strict';

angular.module('iswpApp')
  .factory('StrategiesService', function StrategiesService($http, API_PATH) {
    var service = {};

    var currentData = [];

    service.getCurrent = function () {
      return currentData;
    };

    service.fetch = function(type, typeId) {
      if (_.isEmpty(typeId)) {
        typeId = "";
      }

      var requestPath = "{API_PATH}strategies/{type}/{typeId}".assign({
        API_PATH: API_PATH,
        type: type,
        typeId: typeId
      });

      var prom = $http.get(requestPath, {cache: true})
        .then(function (resp) {
          currentData = resp.data;
          return currentData;
        });

      return prom;
    };

    return service;
  });
