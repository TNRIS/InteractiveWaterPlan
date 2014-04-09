/* global OverlappingMarkerSpiderfier:false */
'use strict';

angular.module('iswpApp')
  .directive('leafletMap',
    function ($rootScope, $state, $stateParams, RegionService, MapLayerService,
      NeedsService, DemandsService, EntityService, CountyService, LegendService,
      MapFactory, STATE_MAP_CONFIG, NEEDS_ENTITY_STYLE, DEMANDS_ENTITY_STYLE) {

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

      function postLink(scope, element, attrs) {

        var map = MapFactory.createMap(element[0], {
          centerLat: STATE_MAP_CONFIG.centerLat,
          centerLng: STATE_MAP_CONFIG.centerLng,
          zoom: STATE_MAP_CONFIG.zoom
        });

        scope.mapLocked = false;
        scope.mapHidden = false;

        //Create a legend for the Needs colors
        var legendControl = LegendService.Needs.createLegend();

        var entityLayer = L.featureGroup().addTo(map),
          countyLayer = L.featureGroup().addTo(map),
          oms = new OverlappingMarkerSpiderfier(map, {
            keepSpiderfied: true,
            nearbyDistance: 5
          });

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
              entityFeature.setStyle(DEMANDS_ENTITY_STYLE);
            }
          }
        );

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
          var childState = _.last($state.current.name.split('.')),
            entityLayerBounds = entityLayer.getBounds();

          switch (childState) {
            case 'region':
              var regionFeat = RegionService.getRegion($stateParams.region);

              //Extend with region bounds to make sure we always have a nice view
              // of the entire region even if there aren't many entities
              var extendedBounds = entityLayerBounds.extend(
                regionFeat.getBounds());

              fitBounds(extendedBounds);
              break;

            case 'type':
              //For demands.type, always just go to state view
              map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
                STATE_MAP_CONFIG.zoom, {animate: false});
              break;

            case 'county':
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

          var currentState = $state.current.name,
            parentState = _.first(currentState.split('.')),
            childState = _.last(currentState.split('.'));

          if (childState === 'summary') {
            MapLayerService.showRegions(map);
            if (!scope.mapLocked) {
              map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
                STATE_MAP_CONFIG.zoom, {animate: false});
            }

            removeLegend();
            return; //don't have anything else to do
          }
          else {
            MapLayerService.removeRegions(map);
            if (parentState === 'needs') {
              showLegend();
            }
          }

          //grab the current year
          var currentYear = $stateParams.year;

          var currentData,
            sumsByEntityId;

          if (parentState === 'demands') {
            currentData = DemandsService.getCurrent();
            sumsByEntityId = DemandsService.getSumsByEntityId(currentYear);
          }
          else if (parentState === 'needs') {
            currentData = NeedsService.getCurrent();
            sumsByEntityId = NeedsService.getSumsByEntityId(currentYear);
          }

          var entities = EntityService.getEntities(_.pluck(currentData, 'EntityId'));

          if (!entities || entities.length === 0) {
            return;
          }

          var maxValue = _.max(sumsByEntityId, 'sum').sum,
            minValue = _.min(sumsByEntityId, 'sum').sum;

          //TODO: figure out how to make the larger entities go on the bottom
          //build marker for each entity

          if (parentState === 'demands') {
            _.each(entities, function(entity) {
              var entityTotalDemand = _.find(
                sumsByEntityId, {'EntityId': '' + entity.EntityId}).sum;

              var scaledRadius = _calculateScaledValue(maxValue, minValue,
                maxRadius, minRadius, entityTotalDemand);

              var featureOpts = _.extend({}, DEMANDS_ENTITY_STYLE, {
                radius: scaledRadius,
                entity: entity //save the entity data in the marker
              });

              var marker = L.circleMarker([entity.Latitude, entity.Longitude],
                featureOpts).addTo(entityLayer);

              var labelString = entity.EntityName;

              marker.bindLabel(labelString);

              if (currentState === 'demands.entity') {
                marker.label.options.noHide = true;
                marker.showLabel();
              }

              //add it to the spiderfier
              oms.addMarker(marker);
            });
          }
          else if (parentState === 'needs') {
            _.each(entities, function(entity) {

              var entityTotalNeed = _.find(
                  sumsByEntityId, {'EntityId': '' + entity.EntityId}).sum;

              var pctOfDemand = _.find(currentData,
                {'EntityId': entity.EntityId})['NPD' + currentYear];

              //find the first color with limit >= pctOfDemand
              var colorEntry = _.find(LegendService.Needs.entityColors, function(c) {
                return c.limit >= pctOfDemand;
              });

              var scaledRadius = _calculateScaledValue(maxValue, minValue,
                maxRadius, minRadius, entityTotalNeed);

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
          }

          entityLayer.bringToFront();

          //Add 'global' event listener to the oms instance
          // to go to the entity view when clicked
          oms.addListener('click', function(marker) {
            if (!marker.options.entity) { return; }

            $state.go(parentState + '.entity', {
              year: currentYear,
              entityId: marker.options.entity.EntityId
            });
          });

          //Set the map bounds according to the current view
          setViewBounds();

        };

        //Update map state every time the state changes
        scope.$on('$stateChangeSuccess', updateMapState);
      }

      return {
        restrict: 'A',
        link: postLink
      };

    });
