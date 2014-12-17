'use strict';

angular.module('iswpApp')
  .factory('MapFactory',
    function MapFactory($rootScope, MapLayerService, STATE_MAP_CONFIG) {

      function createMap(element, options) {
        var map = L.map(element, {
          center: [options.centerLat, options.centerLng],
          zoom: options.zoom,
          attributionControl: false,
          maxBounds: [[15, -150], [45, -50]],
          minZoom: 5,
          maxZoom: 12
        });

        //Use attribution control without 'Leaflet' prefix
        L.control.attribution({prefix: false}).addTo(map);

        MapLayerService.setupRegionLayer();
        MapLayerService.setupBaseLayers(map);

        $rootScope.$on('map:zoomto:centerzoom',
          function (event, mapLoc) {
            map.setView([mapLoc.centerLat, mapLoc.centerLng],
              mapLoc.zoom, {animate: false});
          }
        );

        $rootScope.$on('map:zoomto:bounds',
          function (event, bounds) {
            map.fitBounds(bounds);
          }
        );

        $rootScope.$on('map:zoomto:state',
          function () {
            map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
              STATE_MAP_CONFIG.zoom, {animate: false});
          }
        );

        return map;
      }

      return {createMap: createMap};
    }
  );
