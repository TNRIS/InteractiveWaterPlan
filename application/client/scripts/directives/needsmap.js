/* global OverlappingMarkerSpiderfier:false */
'use strict';

angular.module('iswpApp')
  .constant('NEEDS_ENTITY_STYLE', {
    color: '#000',
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.75
  })
  .directive('needsMap',
    function ($rootScope, $state, $stateParams, RegionService, MapLayerService,
      NeedsService, EntityService, CountyService, LegendService, STATE_MAP_CONFIG,
      NEEDS_ENTITY_STYLE) {

      var minRadius = 6,
        maxRadius = 14;

      function _calculateScaledValue(max, min, scaleMax, scaleMin, val) {
        var scaledVal;
        if (max === min) {
          return scaleMin;
        }
        scaledVal = (scaleMax - scaleMin) * (val - min) / (max - min) + scaleMin;
        return scaledVal;
      }

      return {
        restrict: 'A',
        scope: {
          mapLocked: '=',
          mapHidden: '=',
          mapCenterLat: '=',
          mapCenterLng: '=',
          mapZoom: '='
        },
        link: function postLink(scope, element, attrs) {

          var map = L.map(element[0], {
              center: [scope.mapCenterLat, scope.mapCenterLng],
              zoom: scope.mapZoom,
              attributionControl: false,
              maxBounds: [[15, -150], [45, -50]],
              minZoom: 5,
              maxZoom: 12
            });

          //Use attribution control without 'Leaflet' prefix
          L.control.attribution({prefix: false}).addTo(map);

          map.on('moveend', function() {
            $rootScope.$safeApply(function() {
              var center = map.getCenter();
              scope.mapCenterLat = center.lat;
              scope.mapCenterLng = center.lng;

              scope.mapZoom = map.getZoom();
            });
          });

          //Create a legend for the Needs colors
          var legendControl = LegendService.Needs.createLegend();

          MapLayerService.setupRegionLayer();
          MapLayerService.setupBaseLayers(map);

          var currentYear = $stateParams.year,
            entityLayer = L.featureGroup().addTo(map),
            countyLayer = L.featureGroup().addTo(map),
            oms = new OverlappingMarkerSpiderfier(map, {
              keepSpiderfied: true,
              nearbyDistance: 5
            });

          //setup some event listeners
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

          $rootScope.$on('map:togglehighlight',
            function(event, entity) {
              var entityFeatures = entityLayer.getLayers();
              var entityFeature = _.find(entityFeatures, function(e) {
                return entity.EntityId === e.options.entity.EntityId;
              });

              if (!entityFeature) { return; }

              if (entity.isSelected) {
                entityFeature.setStyle({
                  color: '#ff7518',
                  weight: 2.5,
                  opacity: 1,
                  fillOpacity: 1
                });
                entityFeature.bringToFront();
              }
              else {
                entityFeature.setStyle(NEEDS_ENTITY_STYLE);
              }
            }
          );

          //helper functions
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

          //helper to set view bounds based on current state
          var setViewBounds = function() {
            //do nothing if the map is locked
            if (scope.mapLocked) {
              return;
            }

            var currentState = $state.current.name,
              entityLayerBounds = entityLayer.getBounds();

            //always set animate to false with fitBounds
            // because it seems to bug-out if caught in two animations
            var fitBounds = function(bounds) {
              map.fitBounds(bounds, {animate: false, maxZoom: 10});
            };

            switch (currentState) {
              case 'needs.region':
                var regionFeat = RegionService.getRegion($stateParams.region);

                //Extend with region bounds to make sure we always have a nice view
                // of the entire region even if there aren't many entities
                var extendedBounds = entityLayerBounds.extend(
                  regionFeat.getBounds());

                fitBounds(extendedBounds);
                break;

              case 'needs.type':
                //For needs.type, always just go to state view
                map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
                  STATE_MAP_CONFIG.zoom, {animate: false});
                break;

              case 'needs.county':
                //Extend with county bounds to make sure we always have a nice view
                // of the entire region even if there aren't many entities
                CountyService.fetchCounty($stateParams.county)
                  .then(function(countyFeat) {
                    var extendedBounds = entityLayerBounds.extend(
                      countyFeat.getBounds());

                    fitBounds(extendedBounds);

                    //Also show the county feature outline
                    countyLayer.addLayer(countyFeat)
                      .bringToBack();
                  });
                break;

              default:
                fitBounds(entityLayerBounds);
            }


          };

          //called on stateChangeSuccess to update the map view, entities, etc
          var updateMapState = function() {

            //Clear the spiderfier instance and the entityLayer before creating
            // the new entity features
            oms.clearMarkers();
            entityLayer.clearLayers();
            countyLayer.clearLayers();

            var currentState = $state.current.name;

            if (currentState === 'needs.summary') {
              MapLayerService.showRegions(map);
              removeLegend();
              if (!scope.mapLocked) {
                map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
                  STATE_MAP_CONFIG.zoom, {animate: false});
              }
              return; //don't have anything else to do
            }
            else {
              MapLayerService.removeRegions(map);
              showLegend();
            }


            //Grab the current needs data and entities
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
              minNeed = _.min(needsData, yearNeedKey)[yearNeedKey];


            //TODO: figure out how to make the larger entities go on the bottom
            //build marker for each entity
            _.each(entities, function(entity) {
              var need = NeedsService.getForEntity(entity.EntityId);
              var pctOfDemand = need[yearPctKey];

              //find the first color with limit >= pctOfDemand
              var colorEntry = _.find(LegendService.Needs.entityColors, function(c) {
                return c.limit >= pctOfDemand;
              });

              var scaledRadius = _calculateScaledValue(maxNeed, minNeed,
                maxRadius, minRadius, need[yearNeedKey]);

              var featureOpts = _.extend({}, NEEDS_ENTITY_STYLE, {
                radius: scaledRadius,
                fillColor: colorEntry.color,
                entity: entity //save the entity data in the marker
              });

              var marker = L.circleMarker([entity.Latitude, entity.Longitude],
                featureOpts).addTo(entityLayer);

              var labelString = entity.EntityName + '<br/>' +
                'Needs: ' + pctOfDemand + '% of Demands';

              marker.bindLabel(labelString);

              if (currentState === 'needs.entity') {
                marker.label.options.noHide = true;
                marker.showLabel();
              }

              //add it to the spiderfier
              oms.addMarker(marker);
            });

            entityLayer.bringToFront();

            //Add 'global' event listener to the oms instance
            // to go to the entity view when clicked
            oms.addListener('click', function(marker) {
              if (!marker.options.entity) { return; }

              $state.go('needs.entity', {
                year: currentYear,
                entityId: marker.options.entity.EntityId
              });
            });

            //Set the map bounds according to the current needs view
            setViewBounds();

          };

          scope.$on('$stateChangeSuccess', updateMapState);

          //also call at instantiation of directive
          updateMapState();
        }
      };
    }
  );
