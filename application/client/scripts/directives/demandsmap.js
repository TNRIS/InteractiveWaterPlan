/* global OverlappingMarkerSpiderfier:false */
'use strict';

angular.module('iswpApp')
  .directive('demandsMap',
    function ($rootScope, $state, $stateParams, RegionService, MapLayerService,
      DemandsService, EntityService, CountyService, MapFactory, STATE_MAP_CONFIG,
      DEMANDS_ENTITY_STYLE) {

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

          var map = MapFactory.createMap(scope, element[0]);

          var currentYear = $stateParams.year,
            entityLayer = L.featureGroup().addTo(map),
            countyLayer = L.featureGroup().addTo(map),
            oms = new OverlappingMarkerSpiderfier(map, {
              keepSpiderfied: true,
              nearbyDistance: 5
            });


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
                entityFeature.setStyle(DEMANDS_ENTITY_STYLE);
              }
            }
          );

          //always set animate to false with fitBounds
          // because it seems to bug-out if caught in two animations
          var fitBounds = function(bounds) {
            //do nothing if the map is locked
            if (scope.mapLocked) {
              return;
            }

            map.fitBounds(bounds, {animate: false, maxZoom: 10});
          };

          //helper to set view bounds based on current state
          var setViewBounds = function() {
            var currentState = $state.current.name,
              entityLayerBounds = entityLayer.getBounds();

            switch (currentState) {
              case 'demands.region':
                var regionFeat = RegionService.getRegion($stateParams.region);

                //Extend with region bounds to make sure we always have a nice view
                // of the entire region even if there aren't many entities
                var extendedBounds = entityLayerBounds.extend(
                  regionFeat.getBounds());

                fitBounds(extendedBounds);
                break;

              case 'demands.type':
                //For demands.type, always just go to state view
                map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
                  STATE_MAP_CONFIG.zoom, {animate: false});
                break;

              case 'demands.county':
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

            if (currentState === 'demands.summary') {
              MapLayerService.showRegions(map);
              if (!scope.mapLocked) {
                map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
                  STATE_MAP_CONFIG.zoom, {animate: false});
              }
              return; //don't have anything else to do
            }
            else {
              MapLayerService.removeRegions(map);
            }


            //Grab the current demands data and entities
            var demandsData = DemandsService.getCurrent(),
              entities = EntityService.getEntities(_.pluck(demandsData, 'EntityId'));

            if (!entities || entities.length === 0) {
              return;
            }

            //grab the current year
            currentYear = $stateParams.year;

            var sumsByEntityId = DemandsService.getSumsByEntityId(currentYear);

            var maxDemand = _.max(sumsByEntityId, 'sum').sum,
              minDemand = _.min(sumsByEntityId, 'sum').sum;

            //TODO: figure out how to make the larger entities go on the bottom
            //build marker for each entity
            _.each(entities, function(entity) {
              var entityTotalDemand = _.find(
                sumsByEntityId, {'EntityId': '' + entity.EntityId}).sum;

              var scaledRadius = _calculateScaledValue(maxDemand, minDemand,
                maxRadius, minRadius, entityTotalDemand);

              var featureOpts = _.extend({}, DEMANDS_ENTITY_STYLE, {
                radius: scaledRadius,
                entity: entity //save the entity data in the marker
              });

              var marker = L.circleMarker([entity.Latitude, entity.Longitude],
                featureOpts).addTo(entityLayer);

              var labelString = entity.EntityName;
              //TODO: Show demands acre-feet?

              marker.bindLabel(labelString);

              if (currentState === 'demands.entity') {
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

              $state.go('demands.entity', {
                year: currentYear,
                entityId: marker.options.entity.EntityId
              });
            });

            //Set the map bounds according to the current demands view
            setViewBounds();

          };

          scope.$on('$stateChangeSuccess', updateMapState);

          //also call at instantiation of directive
          updateMapState();
        }
      };
    }
  );
