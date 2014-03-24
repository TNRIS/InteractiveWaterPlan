/* global OverlappingMarkerSpiderfier:false */
'use strict';

angular.module('iswpApp')
  .directive('needsMap',
    function ($rootScope, $state, $stateParams, RegionService, MapLayerService,
      NeedsService, EntityService, CountyService, LegendService) {

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
              maxBounds: [[-16, -170], [68, -20]],
              minZoom: 3,
              maxZoom: 12
            });

          //Use attribution control without 'Leaflet' prefix
          L.control.attribution({prefix: false}).addTo(map);

          //Create a legend for the Needs colors
          var legendControl = LegendService.Needs.createLegend();

          MapLayerService.setupBaseLayers(map);

          var currentYear = $stateParams.year,
            regionLayer = MapLayerService.setupRegionLayer(),
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
                map.setView(stateCenter, stateZoom);
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
              if (!scope.isLocked) {
                map.setView(stateCenter, stateZoom);
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

              var marker = L.circleMarker([entity.Latitude, entity.Longitude], {
                radius: scaledRadius,
                color: '#000',
                weight: 1,
                opacity: 0.5,
                fillColor: colorEntry.color,
                fillOpacity: 0.75,
                entity: entity //save the entity data in the marker
              })
              .bindLabel('' + entity.EntityName + '<br/>' +
                'Needs: ' + pctOfDemand + '% of Demands')
              .addTo(entityLayer);

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
        }
      };
    }
  );
