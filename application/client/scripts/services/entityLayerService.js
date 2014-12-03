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

      var maxValue = _.max(sumsByEntityId, 'sum').sum;
      var minValue = _.min(sumsByEntityId, 'sum').sum;

      var useScaledRadius = childState !== 'entity';

      var currentYear = $stateParams.year;

      //TODO: figure out how to make the larger entities go on the bottom
      _.each(entities, function (entity) {
        var entityTotalVal = _.find(sumsByEntityId, {
          'EntityId': '' + entity.EntityId
        }).sum;

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

        $state.go(parentState + '.entity', {
          year: currentYear,
          entityId: marker.options.entity.EntityId
        });
      });

    };

    return service;
  }
);
