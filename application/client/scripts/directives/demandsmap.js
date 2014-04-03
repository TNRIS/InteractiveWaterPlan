/* global OverlappingMarkerSpiderfier:false */
'use strict';

angular.module('iswpApp')
  .constant('DEMANDS_ENTITY_STYLE', {
    color: '#000',
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.75,
    fillColor: '#a00' //TODO
  })
  .directive('demandsMap',
    function ($rootScope, $state, $stateParams, RegionService, MapLayerService,
      DemandsService, EntityService, CountyService, LegendService, DEMANDS_ENTITY_STYLE) {

      var minRadius = 6,
        maxRadius = 14;

      var stateCenter = [31.780548, -99.022907],
        stateZoom = 5;

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
        link: function postLink(scope, element, attrs) {

          scope.isHidden = false;
          scope.isLocked = false;

          var map = L.map(element[0], {
              center: stateCenter,
              zoom: stateZoom,
              attributionControl: false,
              maxBounds: [[15, -150], [45, -50]],
              minZoom: 5,
              maxZoom: 12
            });

          //Use attribution control without 'Leaflet' prefix
          L.control.attribution({prefix: false}).addTo(map);

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
              map.setView(stateCenter, stateZoom);
            }
          );

          $rootScope.$on('map:togglelock',
            function(event, isLocked) {
              scope.isLocked = isLocked;
            }
          );

          $rootScope.$on('map:togglehide',
            function(event, isHidden) {
              scope.isHidden = isHidden;
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
                entityFeature.setStyle(DEMANDS_ENTITY_STYLE);
              }
            }
          );

          //helper to set view bounds based on current state
          var setViewBounds = function() {
            //do nothing if the map isLocked
            if (scope.isLocked) {
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
                map.setView(stateCenter, stateZoom);
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
              if (!scope.isLocked) {
                map.setView(stateCenter, stateZoom);
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

            var yearDemandKey = 'D' + currentYear,
              maxDemand = _.max(demandsData, yearDemandKey)[yearDemandKey],
              minDemand = _.min(demandsData, yearDemandKey)[yearDemandKey];


            //TODO: figure out how to make the larger entities go on the bottom
            //build marker for each entity
            _.each(entities, function(entity) {
              var demand = DemandsService.getForEntity(entity.EntityId);

              var scaledRadius = _calculateScaledValue(maxDemand, minDemand,
                maxRadius, minRadius, demand[yearDemandKey]);

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
