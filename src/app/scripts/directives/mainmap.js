'use strict';

angular.module('iswpApp')
  .directive('mainMap',
    function ($rootScope, localStorageService, MapLayerService) {
      return {
        template: '<div></div>',
        restrict: 'AE',
        scope: {
          showRegions: '=',
          entities: '='
        },
        link: function postLink(scope, element, attrs) {

          var map = L.map(element[0], {
              center: [31.780548, -99.022907],
              zoom: 5,
              attributionControl: false,
              maxBounds: [[-16, -170], [68, -20]],
              minZoom: 3,
              maxZoom: 12
            });

          //Use attribution control without 'Leaflet' prefix
          L.control.attribution({prefix: false}).addTo(map);

          //TODO: Are we using this?
          // var updateStoredMapLocation = _.debounce(function() {
          //   var center = map.getCenter(),
          //       zoom = map.getZoom(),
          //       precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2)),
          //       lat = center.lat.toFixed(precision),
          //       lng = center.lng.toFixed(precision);

          //   //Set in LocalStorage
          //   localStorageService.set('mapLocation', {
          //     zoom: zoom,
          //     centerLat: lat,
          //     centerLng: lng
          //   });

          //   scope.$apply();
          // }, 250, {trailing: true});

          // map.on('moveend', updateStoredMapLocation);

          MapLayerService.setupLayers(map);

          var regionLayer = MapLayerService.setupRegionLayer(scope);

          //TODO: figure out how to spiderfy at zoom level 12 always
          var entityLayer = new L.MarkerClusterGroup({
            showCoverageOnHover: false,
            iconCreateFunction: function(cluster) {
              var childCount = cluster.getChildCount();

              var c = ' marker-cluster-';
              if (childCount < 10) {
                c += 'small';
              } else if (childCount < 100) {
                c += 'medium';
              } else {
                c += 'large';
              }

              return new L.DivIcon(
                {html: '<div><span>' + childCount + '</span></div>',
                className: 'marker-cluster' + c,
                iconSize: new L.Point(24, 24)
              });
            },
            //using small radius so only the county-level entities are clustered
            maxClusterRadius: 1
          });
          entityLayer.addTo(map);

          //TODO: Use bound attributes instead of event listeners?
          $rootScope.$on('map:zoomto:centerzoom',
            function(event, mapLoc) {
              map.setView([mapLoc.centerLat, mapLoc.centerLng],
                mapLoc.zoom);
            }
          );

          $rootScope.$on('map:zoomto:bounds',
            function(event, bounds) {
              map.fitBounds(bounds);
            }
          );

          scope.$watch('showRegions', function() {
            if (scope.showRegions) {
              regionLayer.addTo(map);
            }
            else if (map.hasLayer(regionLayer)) {
              map.removeLayer(regionLayer);
            }
          });

          //TODO: Color by needs as % of demands
          var entityColors = [
              '#1a9641', //green
              '#a6d96a',
              '#ffffbf',
              '#fdae61',
              '#d7191c' //red
            ],
            minRadius = 6,
            maxRadius = 12;

          //TODO: Make sure values change when year changes
          scope.$watchCollection('entities', function() {
            if (!scope.entities || scope.entities.length === 0) {
              return;
            }

            entityLayer.clearLayers();
            _.each(scope.entities, function(entity) {

              //TODO: Lat/Lon columns are incorrectly labeled in source
              // database. Need Sabrina to fix.
              L.circleMarker([entity.Longitude, entity.Latitude], {
                radius: minRadius,
                color: entityColors[0],
                weight: 2,
                opacity: 1,
                fillColor: entityColors[0],
                fillOpacity: 0.6

              })
                .bindLabel('' + entity.EntityName)
                .addTo(entityLayer);
            });

            entityLayer.bringToFront();

          });

        }
      };
    }
  );
