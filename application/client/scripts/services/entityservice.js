'use strict';

//Service to hold current Water User Group Entities
// to be show on the map
angular.module('iswpApp')
  .factory('EntityService', function EntityService($http, API_PATH) {
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
      return _.first(service.getEntities(entityId));
    };

    service.getEntities = function(entityIds) {
      var idArr,
        toInt = function(n) {
          return parseInt(n, 10);
        };

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

    service.fetchSummary = function(entityId) {
      var requestPath = API_PATH + 'entity/' + entityId + '/summary';
      var prom = $http.get(requestPath)
        .then(function(resp) {
          return resp.data;
        });

      return prom;
    };

    service.search = function(namePart) {
      var requestPath = API_PATH + 'entity/search?name=' + namePart;

      var prom = $http.get(requestPath)
        .then(function(resp) {
          return resp.data;
        });

      return prom;
    };

    return service;
  });
