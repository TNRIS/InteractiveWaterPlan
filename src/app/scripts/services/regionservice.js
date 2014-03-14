/* global omnivore */
'use strict';

//Service to indicate if the Water Planning Regions
// should be shown
angular.module('iswpApp')
  .service('RegionService', function RegionService(ISWP_VARS) {
    var service = {};

    service.regionFeatures = omnivore.topojson.parse(
      ISWP_VARS.regionsTopo);

    service.getRegion = function(regionLetter) {
      regionLetter = regionLetter.toUpperCase();
      var regionObj = _.find(service.regionFeatures, 
        function (f) {
          return f.properties.region === regionLetter;
        }
      );

      if (regionObj) {
        return L.geoJson(regionObj); 
      }

      return null;
    };

    return service;
  });
