'use strict';

//Service to hold current Water User Group Entities
// to be show on the map
angular.module('iswpApp')
  .service('EntityService', function EntityService($http, API_PATH) {
    var service = {};

    service.entities = [];

    service.fetch = function() {

      var requestPath =  API_PATH + 'entity';

      var prom = $http.get(requestPath, {cache: true})
        .then(function(resp) {
          service.entities = resp.data;
          return service.entities;
        });

      return prom;
    };

    service.getEntitiesByIds = function(entityIds) {
      if (!_.isArray(entityIds)) {
        entityIds = [entityIds];
      }

      return _.where(service.entities, function (e) {
        return _.contains(entityIds, e.EntityId);
      });
    };

    return service;
  });
