'use strict';

//Service to hold current Water User Group Entities
// to be show on the map
angular.module('iswpApp')
  .factory('StrategySourceService', function StrategySourceService($http, API_PATH) {
    var service = {};

    service.sources = [];

    service.fetch = function() {

      var requestPath =  API_PATH + 'sources/strategy';

      var prom = $http.get(requestPath, {cache: true})
        .then(function(resp) {
          service.sources = resp.data;
          return service.sources;
        });

      return prom;
    };

    service.getSource = function(sourceId) {
      return _.first(service.getSources(sourceId));
    };

    service.getSources = function(sourceIds) {
      var idArr,
        toInt = function(n) {
          return parseInt(n, 10);
        };

      if (!_.isArray(sourceIds)) {
        idArr = [toInt(sourceIds)];
      }
      else {
        idArr = _.map(sourceIds, toInt);
      }

      return _.filter(service.sources, function (e) {
        return _.contains(idArr, e.MapSourceId);
      });
    };

    return service;
  });
