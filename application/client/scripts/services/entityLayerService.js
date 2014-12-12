'use strict';
/* global OverlappingMarkerSpiderfier:false */
angular.module('iswpApp').factory('EntityLayerService',
  function ($state, $stateParams, Utils, LegendService, ENTITY_SINGLE_RADIUS, ENTITY_STYLES) {

    var service = {};
    var entityLayer;
    var oms;

    service.createLayer = function (map) {
      entityLayer =  L.featureGroup();
      entityLayer.addTo(map);

      oms = new OverlappingMarkerSpiderfier(map, {
        keepSpiderfied: true,
        nearbyDistance: 5
      });

      return entityLayer;
    };

    service.getLayer = function () {
      return entityLayer;
    };

    service.clearLayer = function () {
      oms.clearMarkers();
      entityLayer.clearLayers();
    };

    service.addEntities = function (entities, currentData, sumsByEntityId) {
      if (!entityLayer || !oms) {
        throw new Error('Must call createLayer() first');
      }

      var currentState = $state.current.name;
      var parentState = _.first(currentState.split('.'));
      var childState = _.last(currentState.split('.'));

      var maxValue = _.max(sumsByEntityId);
      var minValue = _.min(sumsByEntityId);

      var useScaledRadius = childState !== 'entity';

      var currentYear = $stateParams.year;

      _(entities)
        .filter(function (entity) {
          return angular.isDefined(sumsByEntityId[entity.EntityId]);
        })
        .sort(function (entity) {
          return sumsByEntityId[entity.EntityId];
        })
        .reverse()
        .each(function (entity) {
          var entityTotalVal = sumsByEntityId[entity.EntityId];

          if (angular.isUndefined(entityTotalVal)) {
            return;
          }

          var radius = useScaledRadius ?
            Utils.scaleRadius(maxValue, minValue, entityTotalVal) : ENTITY_SINGLE_RADIUS;

          var entityStyle = ENTITY_STYLES[parentState];
          if (!entityStyle) {
            throw new Error('Undefined ENTITY_STYLE for state ' + parentState);
          }

          var featureOpts = _.extend({}, entityStyle, {
            radius: radius,
            entity: entity //save the entity data in the marker
          });

          var labelString = entity.EntityName;

          if (parentState === 'needs') {
            var pctOfDemand = _.find(currentData,
              {'EntityId': entity.EntityId})['NPD' + currentYear];

            var colorEntry = _.find(LegendService.Needs.entityColors, function(c) {
              return c.limit >= pctOfDemand;
            });

            featureOpts.fillColor = colorEntry.color;

            labelString = entity.EntityName + '<br/>' +
              'Needs: ' + pctOfDemand + '% of Demands';
          }

          var marker = L.circleMarker([entity.Latitude, entity.Longitude],
            featureOpts).addTo(entityLayer);

          marker.bindLabel(labelString);

          if (childState === 'entity') {
            marker.label.options.noHide = true;
            marker.showLabel();
          }

          //kind of a hacky way to get the click event
          // into the oms click handler
          marker.on('click', function (e) {
            var evt = e.originalEvent || e;
            marker.clickEvent = evt;
            return;
          });

          //add it to the spiderfier
          oms.addMarker(marker);

          return;
        }
      );

      entityLayer.bringToFront();

      //Add 'global' event listener to the oms instance
      // to go to the entity view when clicked
      oms.addListener('click', function (marker) {
        if (!marker.options.entity) { return; }
        if (marker.clickEvent) {
          //stop click even propagation so that
          // utfGrid click events don't trigger
          //this clickEvent is added above
          marker.clickEvent.stopPropagation();
        }

        $state.go(parentState + '.entity', {
          year: currentYear,
          entityId: marker.options.entity.EntityId
        });

      });

    };

    return service;
  }
);
