'use strict';

angular.module('iswpApp')
  .factory('MapFactory',
    function MapFactory($rootScope, MapLayerService, STATE_MAP_CONFIG) {

      //scope must have:
      //  mapCenterLat: double
      //  mapCenterLng: double
      //  mapZoom: int
      //  mapLocked: bool
      //  mapHidden: bool

      function createMap(scope, element) {
        var map = L.map(element, {
          center: [scope.mapCenterLat, scope.mapCenterLng],
          zoom: scope.mapZoom,
          attributionControl: false,
          maxBounds: [[15, -150], [45, -50]],
          minZoom: 5,
          maxZoom: 12
        });

        //Use attribution control without 'Leaflet' prefix
        L.control.attribution({prefix: false}).addTo(map);

        MapLayerService.setupRegionLayer();
        MapLayerService.setupBaseLayers(map);

        map.on('moveend', function() {
          $rootScope.$safeApply(function() {
            var center = map.getCenter();
            scope.mapCenterLat = center.lat;
            scope.mapCenterLng = center.lng;

            scope.mapZoom = map.getZoom();
          });
        });

        $rootScope.$on('map:zoomto:centerzoom',
          function(event, mapLoc) {
            map.setView([mapLoc.centerLat, mapLoc.centerLng],
              mapLoc.zoom, {animate: false});
          }
        );

        $rootScope.$on('map:zoomto:bounds',
          function(event, bounds) {
            map.fitBounds(bounds);
          }
        );

        $rootScope.$on('map:zoomto:state',
          function(event) {
            map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
              STATE_MAP_CONFIG.zoom, {animate: false});
          }
        );

        $rootScope.$on('map:togglelock',
          function(event, isLocked) {
            scope.mapLocked = isLocked;
          }
        );

        $rootScope.$on('map:togglehide',
          function(event, isHidden) {
            scope.mapHidden = isHidden;
          }
        );

        return map;
      }

      return {createMap: createMap};
    }
  );
