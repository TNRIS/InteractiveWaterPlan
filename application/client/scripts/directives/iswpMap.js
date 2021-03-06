'use strict';

angular.module('iswpApp').directive('iswpMap',
  function ($rootScope, $state, $stateParams, $q, RegionService, MapLayerService,
    NeedsService, DemandsService, EntityService, CountyService, LegendService,
    EntityLayerService, StrategiesService, SuppliesService, MapFactory,
    SourceLayerService, MapSettingsService, DATA_VALUE_PREFIXES, STATE_MAP_CONFIG) {

    function postLink(scope, element) {
      var map = MapFactory.createMap(element[0], {
        centerLat: STATE_MAP_CONFIG.centerLat,
        centerLng: STATE_MAP_CONFIG.centerLng,
        zoom: STATE_MAP_CONFIG.zoom
      });

      window.map = map;

      scope.mapLocked = MapSettingsService.isMapLocked;
      scope.mapHidden = MapSettingsService.isMapHidden;

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

      scope.$watch(MapSettingsService.getIsMapLocked, function (val) {
        scope.mapLocked = val;
      });

      scope.$watch(MapSettingsService.getIsMapHidden, function (val) {
        scope.mapHidden = val;
      });

      $rootScope.$on('map:togglehighlight',
        function (event, entity) {
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

      function clearLayers() {
        EntityLayerService.clearLayer();
        countyLayer.clearLayers();
        if (sourceLayer && map.hasLayer(sourceLayer)) {
          map.removeLayer(sourceLayer);
          sourceLayer = null;
        }

        //clear all labels on state change
        map.eachLayer(function (lyr) {
          if (lyr instanceof L.Label) {
            map.removeLayer(lyr);
          }
        });

      }

      //always set animate to false with fitBounds
      // because it seems to bug-out if caught in two animations
      function fitBounds(bounds) {
        //do nothing if the map is locked
        if (scope.mapLocked || !bounds.isValid()) {
          return;
        }

        map.fitBounds(bounds, {animate: false, maxZoom: 10});
      }

      function addViewFeatures(currentData) {
        var currentState = $state.current.name;
        var parentState = _.first(currentState.split('.'));
        var childState = _.last(currentState.split('.'));
        var currentYear = $stateParams.year;

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


        if (parentState === 'strategies' || parentState === 'supplies') {
          //Get all the sourceIds of the sources to show
          var sourceIds = _(currentData)
            .filter(function (d) {
              var valKey = DATA_VALUE_PREFIXES[parentState] + currentYear;
              return angular.isDefined(d[valKey]); }
            )
            .pluck('MapSourceId')
            .compact()
            .unique()
            .value();

          if (!_.isEmpty(sourceIds)) {
            //create and add the new sourceLayer to the map
            var sourceProm = SourceLayerService.createLayer(sourceIds, map)
              .then(function (newSourceLayer) {
                sourceLayer = newSourceLayer;
                //also get the bounds of the source layer features
                // and save them into sourceLayer

                return SourceLayerService.getBounds(sourceIds)
                  .then(function (bounds) {
                    sourceLayer.layerBounds = bounds;
                    return sourceLayer;
                  });
              });
            promises.push(sourceProm);
          }
        }

        return $q.all(promises);
      }

      //helper to set view bounds based on current state
      function setViewBounds() {
        var childState = _.last($state.current.name.split('.'));
        var entityLayerBounds = entityLayer.getBounds();
        var extendedBounds;

        var extendSourceLayerBounds = function (otherBounds) {
          //layerBounds is saved into the layer during sourceLayer creation
          if (sourceLayer && sourceLayer.layerBounds) {
            extendedBounds = otherBounds.extend(sourceLayer.layerBounds);
            return extendedBounds;
          }

          return otherBounds;
        };

        switch (childState) {
          case 'region':
            var regionFeat = RegionService.getRegion($stateParams.region);

            //Extend with region bounds to make sure we always have a nice view
            // of the entire region even if there aren't many entities
            extendedBounds = entityLayerBounds.extend(
              regionFeat.getBounds());

            extendedBounds = extendSourceLayerBounds(extendedBounds);

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

            extendedBounds = extendSourceLayerBounds(extendedBounds);

            fitBounds(extendedBounds);
            break;

          case 'entity':
            extendedBounds =  extendSourceLayerBounds(entityLayerBounds);
            fitBounds(entityLayerBounds);
            break;

          case 'source':
            extendedBounds =  extendSourceLayerBounds(entityLayerBounds);
            fitBounds(entityLayerBounds);
            break;
          default:
            fitBounds(entityLayerBounds);
        }
      }

      //called on stateChangeSuccess to update the map view, entities, etc
      function updateMapState() {

        clearLayers();

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

        //add a listener that prevents state changes before the current view
        // has been finalized
        var deregisterListener = scope.$on('$stateChangeStart', function (evt) {
          evt.preventDefault();
        });

        //add additional features
        addViewFeatures(currentData)
          .then(function () {
            //Set the map bounds according to the current view
            setViewBounds();
            return;
          })
          .finally(function () {
            //deregister the stateChangeStart event that was added above
            // so that state changes can happen normally
            deregisterListener();
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
