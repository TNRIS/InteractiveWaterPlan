'use strict';

angular.module('iswpApp').directive('leafletMap',
  function ($rootScope, $state, $stateParams, $q, RegionService, MapLayerService,
    NeedsService, DemandsService, EntityService, CountyService, LegendService,
    EntityLayerService, StrategiesService, SuppliesService, MapFactory,
    SourceLayerService, STATE_MAP_CONFIG, $http) {

    function postLink(scope, element, attrs) {

      var map = MapFactory.createMap(element[0], {
        centerLat: STATE_MAP_CONFIG.centerLat,
        centerLng: STATE_MAP_CONFIG.centerLng,
        zoom: STATE_MAP_CONFIG.zoom
      });

      window.map = map;

      scope.mapLocked = false;
      scope.mapHidden = false;

      //Create a legend for the Needs colors
      var legendControl = LegendService.Needs.createLegend();

      var sourceLayer;
      var countyLayer = L.featureGroup().addTo(map);
      var entityLayer = EntityLayerService.createLayer(map);

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
            entityFeature.origStyle = entityFeature.options;
            entityFeature.setStyle({
              color: '#ff7518',
              weight: 2.5,
              opacity: 1,
              fillOpacity: 1
            });
            entityFeature.bringToFront();
            entityFeature.showLabel();
          }
          else {
            entityFeature.setStyle(entityFeature.origStyle);
            entityFeature.hideLabel();
          }
        }
      );

      function showLegend() {
        if (!legendControl.isAdded) {
          legendControl.addTo(map);
        }
      }

      function removeLegend() {
        if (legendControl.isAdded) {
          legendControl.removeFrom(map);
        }
      }

      //always set animate to false with fitBounds
      // because it seems to bug-out if caught in two animations
      function fitBounds(bounds) {
        //do nothing if the map is locked
        if (scope.mapLocked) {
          return;
        }

        map.fitBounds(bounds, {animate: false, maxZoom: 10});
      }

      function addViewFeatures(currentData) {
        var currentState = $state.current.name;
        var parentState = _.first(currentState.split('.'));
        var childState = _.last(currentState.split('.'));

        var promises = [];

        if (childState === 'county') {
          var countyProm = CountyService.fetchCounty($stateParams.county)
            .then(function (countyFeat) {
              countyLayer.addLayer(countyFeat)
                .bringToBack();
              return;
            });
          promises.push(countyProm);
        }

        var hasSources = ['strategies.county', 'strategies.entity',
          'sources.county', 'sources.entity'];

        if (_.contains(hasSources, currentState)) {
          var sourceIds = _(currentData).pluck('MapSourceId')
            .filter().unique().value();
          //create and add the new sourceLayer to the map
          var sourceProm = SourceLayerService.createLayer(sourceIds, map)
            .then(function (newSourceLayer) {
              sourceLayer = newSourceLayer;
              //also get the bounds of the source layer features
              // and save them intou sourceLayer
              return SourceLayerService.getBounds(sourceIds)
                .then(function (bounds) {
                  sourceLayer.layerBounds = bounds;
                  return sourceLayer;
                });
            });
          promises.push(sourceProm);
        }

        return $q.all(promises);
      }

      //helper to set view bounds based on current state
      function setViewBounds() {
        var childState = _.last($state.current.name.split('.'));
        var entityLayerBounds = entityLayer.getBounds();
        var extendedBounds;

        switch (childState) {
          case 'region':
            var regionFeat = RegionService.getRegion($stateParams.region);

            //Extend with region bounds to make sure we always have a nice view
            // of the entire region even if there aren't many entities
            extendedBounds = entityLayerBounds.extend(
              regionFeat.getBounds());

            fitBounds(extendedBounds);
            break;

          case 'type':
            //For demands.type, always just go to state view
            if (scope.mapLocked) {
              //unless map is locked
              return;
            }
            map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
              STATE_MAP_CONFIG.zoom, {animate: false});
            break;

          case 'county':
            //Extend with county bounds to make sure we always have a nice view
            // of the entire region even if there aren't many entities
            extendedBounds = entityLayerBounds.extend(
              countyLayer.getBounds());

            //layerBounds is saved into the layer during sourceLayer creation
            if (sourceLayer && sourceLayer.layerBounds) {
              extendedBounds = extendedBounds.extend(sourceLayer.layerBounds);
            }

            fitBounds(extendedBounds);
            break;

          default:
            fitBounds(entityLayerBounds);
        }
      }

      //called on stateChangeSuccess to update the map view, entities, etc
      function updateMapState() {
        //Clear the spiderfier instance and the entityLayer before creating
        // the new entity features
        EntityLayerService.clearLayer();
        countyLayer.clearLayers();
        if (sourceLayer && map.hasLayer(sourceLayer)) {
          map.removeLayer(sourceLayer);
          sourceLayer = null;
        }

        var currentYear = $stateParams.year;

        var currentState = $state.current.name;
        var parentState = _.first(currentState.split('.'));
        var childState = _.last(currentState.split('.'));

        //show or hide the legend
        if (parentState === 'needs' && childState !== 'summary') {
          showLegend();
        }
        else {
          removeLegend();
        }

        if (childState === 'summary') {
          MapLayerService.showRegions(map);
          if (!scope.mapLocked) {
            map.setView([STATE_MAP_CONFIG.centerLat, STATE_MAP_CONFIG.centerLng],
              STATE_MAP_CONFIG.zoom, {animate: false});
          }

          return; //don't have anything else to do
        }

        //else...
        MapLayerService.removeRegions(map);

        var currentData;
        var sumsByEntityId;

        switch (parentState) {
          case 'demands':
            currentData = DemandsService.getCurrent();
            sumsByEntityId = DemandsService.getSumsByEntityId(currentYear);
            break;
          case 'needs':
            currentData = NeedsService.getCurrent();
            sumsByEntityId = NeedsService.getSumsByEntityId(currentYear);
            break;
          case 'strategies':
            currentData = StrategiesService.getCurrent();
            sumsByEntityId = StrategiesService.getSumsByEntityId(currentYear);
            break;
          case 'supplies':
            currentData = SuppliesService.getCurrent();
            sumsByEntityId = SuppliesService.getSumsByEntityId(currentYear);
            break;
          default:
            throw new Error('Invalid parent state');
        }

        var entities = EntityService.getEntities(_.pluck(currentData, 'EntityId'));

        if (!entities || entities.length === 0) {
          return;
        }

        //add entity markers
        EntityLayerService.addEntities(entities, currentData, sumsByEntityId);

        //add additional features
        addViewFeatures(currentData)
          .then(function () {
            //Set the map bounds according to the current view
            setViewBounds();
          });

      }

      //Update map state every time the state changes
      scope.$on('$stateChangeSuccess', updateMapState);
    }

    return {
      restrict: 'A',
      link: postLink
    };

  });
