'use strict';

angular.module('iswpApp')
  .factory('SourceService', function SourceService($http, API_PATH, SOURCE_STYLES) {
    var service = {};

    service.fetchSource = function (sourceId) {
      var requestPath = API_PATH + 'sources/' + sourceId;
      var prom = $http.get(requestPath, {cache: true})
        .then(function (res) {
          //convert to leaflet feature
          var sourceFeat = L.geoJson(res.data);

          sourceFeat.setStyle({
            //TODO: define a style map somewhere
          });

          return sourceFeat;
        });

      return prom;
    };

    service.fetchSources = function (sourceIdArr) {
      var sourceIdStr = sourceIdArr.join(',');
      var requestPath = API_PATH + 'sources?ids=' + sourceIdStr;
      var prom = $http.get(requestPath, {cache: true})
        .then(function (res) {
          //convert to leaflet feature
          var sourceFeat = L.geoJson(res.data);

          sourceFeat.setStyle({
            //TODO: define a style map somewhere
          });

          return sourceFeat;
        });

      return prom;
    };

    return service;
  });
