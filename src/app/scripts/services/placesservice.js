'use strict';

angular.module('iswpApp')
  .service('PlacesService', function PlacesService($http, $q, API_PATH) {
    var service = {};

    service.counties = [];
    service.regions = [];
    service.regions.topojson = {};

    service.fetch = function() {
      var countiesProm = $http.get(API_PATH + 'places/counties',
        {cache: true})
          .success(function(data){
            angular.copy(data, service.counties);
          }
        );

      var regionsProm = $http.get(API_PATH + 'places/regions',
        {cache: true})
          .success(function(data){
            angular.copy(data, service.regions);
          }
        );

      var regionsTopoProm = $http.get(API_PATH + 'places/regions.topojson',
        {cache: true})
          .success(function(data){
            angular.copy(data, service.regions.topojson);
          }
        );

      return $q.all([countiesProm, regionsProm, regionsTopoProm]);
    };

    return service;
  });
