'use strict';

angular.module('iswpApp')
  .service('NeedsService', function NeedsService($http, API_PATH) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = {};

    service.needs = [];

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
          return resp.data;
        });

      return prom;
    };

    return service;
  });
