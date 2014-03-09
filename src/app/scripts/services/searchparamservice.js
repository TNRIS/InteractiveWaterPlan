'use strict';

//Service to get window location search parameters
angular.module('iswpApp')
  .service('SearchParamService', function SearchParamService($location) {
    var service = {};

    service.getCenterZoomParams = function() {
      var searchParams = $location.search();
      
      //validate params, return null if any problems
      if (!(searchParams.zoom && searchParams.center)) {
        return null;
      }

      var latLng = searchParams.center.split(",");
      if (latLng.length !== 2) { return null; }

      var zoom = parseInt(searchParams.zoom, 10),
          centerLat = parseFloat(latLng[0]),
          centerLng = parseFloat(latLng[1]);

      if (_.isNaN(zoom) || _.isNaN(centerLat) || 
        _.isNaN(centerLng)) {
        return null;
      }

      if (zoom < 0 || zoom > 18) { return null; }

      return {
        zoom: zoom,
        centerLat: centerLat,
        centerLng: centerLng
      };
    };

    return service;
  });