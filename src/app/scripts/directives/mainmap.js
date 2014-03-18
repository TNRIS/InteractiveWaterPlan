/* global OverlappingMarkerSpiderfier:false */
'use strict';

angular.module('iswpApp')
  .directive('mainMap',
    function ($rootScope, $state, $stateParams, localStorageService, MapLayerService, NeedsService, EntityService) {

      var entityColors = [
          {limit: 10, color: '#1A9641'}, //green
          {limit: 25, color: '#A6D96A'},
          {limit: 50, color: '#FFFFBF'},
          {limit: 75, color: '#FDAE61'},
          {limit: 100, color: '#D7191C'} //red
        ],
        minRadius = 6,
        maxRadius = 14;

      function _calculateScaledValue(max, min, scaleMax, scaleMin, val) {
        var scaledVal;
        if (max === min) {
          return scaleMin;
        }
        scaledVal = (scaleMax - scaleMin) * (val - min) / (max - min) + scaleMin;
        return scaledVal;
      }

      function _createLegend() {
        var legend = L.control({
          position: 'bottomleft'
        });

        legend.onAdd = function(map) {
          this._div = L.DomUtil.create('div', 'leaflet-legend legend-needs');
          this._update();
          this.isAdded = true;
          return this._div;
        };

        legend.onRemove = function() {
          this.isAdded = false;
        };

        legend._update = function() {
          for (var i=entityColors.length-1; i >= 0; i--) {
            var colorEntry = entityColors[i],
              legendEntry = L.DomUtil.create('p', 'legend-entry', this._div);

            legendEntry.innerHTML = '<svg height="14" width="14">' +
            '  <circle cx="7" cy="7" r="6" stroke="black" stroke-width="1"' +
                'fill="' + colorEntry.color + '" /></svg>';

            legendEntry.innerHTML+= ' Need &le; ' + colorEntry.limit + '% of Demand';
          }
        };

        return legend;
      }

      return {
        restrict: 'A',
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

          //Create a legend for the Needs colors
          //TODO: generalize for other non-Needs Themes

          var legendControl = _createLegend();


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

          MapLayerService.setupBaseLayers(map);

          var currentYear = $stateParams.year,
            regionLayer = MapLayerService.setupRegionLayer(),
            entityLayer = L.featureGroup().addTo(map),
            oms = new OverlappingMarkerSpiderfier(map, {
              keepSpiderfied: true,
              nearbyDistance: 5
            });

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

          $rootScope.$on('map:zoomto:state',
            function(event) {
              map.setView([31.780548, -99.022907], 5);
            }
          );


          var showRegions = function() {
            if (!map.hasLayer(regionLayer)) {
              regionLayer.addTo(map);
            }
          };

          var removeRegions = function() {
            if (map.hasLayer(regionLayer)) {
              map.removeLayer(regionLayer);
            }
          };

          var showLegend = function() {
            if (!legendControl.isAdded) {
              legendControl.addTo(map);
            }
          };

          var removeLegend = function() {
            if (legendControl.isAdded) {
              legendControl.removeFrom(map);
            }
          };

          var updateMapState = function() {

            var currentState = $state.current.name;

            if (currentState === 'needs.summary') {
              showRegions();
              removeLegend();
            }
            else {
              removeRegions();
              showLegend();
            }

            oms.clearMarkers();
            entityLayer.clearLayers();

            //TODO: Will need to refactor to generalize for Themes other than Needs
            var needsData = NeedsService.getCurrent(),
              entities = EntityService.getEntities(_.pluck(needsData, 'EntityId'));

            if (!entities || entities.length === 0) {
              return;
            }

            //grab the current year
            currentYear = $stateParams.year;

            var yearNeedKey = 'N' + currentYear,
              yearPctKey = 'NPD' + currentYear,
              maxNeed = _.max(needsData, yearNeedKey)[yearNeedKey],
              minNeed = _.min(needsData, yearNeedKey)[yearNeedKey],
              //sort so that largest will be on bottom when there is overlap
              // of the county-centroid entities
              sortedEntities = _.sortBy(entities, yearNeedKey).reverse();

            _.each(sortedEntities, function(entity) {
              var need = NeedsService.getForEntity(entity.EntityId);
              var pctOfDemand = parseInt(need[yearPctKey], 10);

              //find the first color with limit >= pctOfDemand
              var colorEntry = _.find(entityColors, function(c) {
                return c.limit >= pctOfDemand;
              });

              var scaledRadius = _calculateScaledValue(maxNeed, minNeed,
                maxRadius, minRadius, need[yearNeedKey]);

              var marker = L.circleMarker([entity.Latitude, entity.Longitude], {
                radius: scaledRadius,
                color: '#000',
                weight: 1,
                opacity: 0.5,
                fillColor: colorEntry.color,
                fillOpacity: 0.75
              })
              .bindLabel('' + entity.EntityName)
              .addTo(entityLayer);

              //add it to the spiderfier
              oms.addMarker(marker);
            });

          };

          scope.$on('$stateChangeSuccess', updateMapState);
        }
      };
    }
  );
