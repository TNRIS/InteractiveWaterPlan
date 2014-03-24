'use strict';

angular.module('iswpApp')
  .factory('CountyService', function CountyService($http, API_PATH, ISWP_VARS) {
    var service = {};

    service.fetchCounty = function(countyName) {
      countyName = countyName.toUpperCase();

      if (!_.contains(ISWP_VARS.counties, countyName)) {
        return;
      }

      var requestPath = API_PATH + 'places/county/' + countyName + '.geojson';
      var prom = $http.get(requestPath, {cache: true})
        .then(function(res) {
          //convert to leaflet feature
          var countyFeat = L.geoJson(res.data);

          countyFeat.setStyle({
            fill: false,
            color: '#ffcc00',
            weight: 3,
            opacity: 1
          });

          return countyFeat;
        });

      return prom;
    };

    return service;
  });
