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

    service.getEntity = function(entityId) {
      return _.first(service.getEntitiesByIds(entityId));
    };

    service.getEntitiesByIds = function(entityIds) {
      var idArr,
        toInt = _.partialRight(parseInt, 10);

      if (!_.isArray(entityIds)) {
        idArr = [toInt(entityIds)];
      }
      else {
        idArr = _.map(entityIds, toInt);
      }

      return _.where(service.entities, function (e) {
        return _.contains(idArr, e.EntityId);
      });
    };

    return service;
  });
