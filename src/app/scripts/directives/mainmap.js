/* global omnivore */
'use strict';

angular.module('iswpApp')
  .directive('mainMap',
    function ($location, $routeParams, $timeout, RegionService, SearchParamService, BING_API_KEY, SWP_WMS_URL, ISWP_VARS) {

      function _setupLayers(map) {
        // Base Layers
        var esriGray = L.esri.basemapLayer("Gray");

        var mqOpen = L.tileLayer(
          'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
          subdomains: ['otile1', 'otile2', 'otile3', 'otile4'],
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
              '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.' +
              'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>'
        });

        var mqAerial = L.tileLayer(
          'http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
          subdomains: ['otile1', 'otile2', 'otile3', 'otile4'],
          attribution: 'Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency. ' +
              'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>'
        });

        var bingRoad = L.bingLayer(BING_API_KEY, {type: 'Road'});
        var bingHybrid = L.bingLayer(BING_API_KEY, {type: 'AerialWithLabels'});
        var bingAerial = L.bingLayer(BING_API_KEY, {type: 'Aerial'});

        // Overlay WMS Layers
        var planningAreas = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '4,7',
          format: 'image/png',
          transparent: true
        });

        var counties = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '1,9',
          format: 'image/png',
          transparent: true
        });

        var countyLabels = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '9',
          format: 'image/png',
          transparent: true
        });

        var senateDistricts = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '3,13',
          format: 'image/png',
          transparent: true
        });

        var houseDistricts = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '2,11',
          format: 'image/png',
          transparent: true
        });

        var baseMaps = {
          'Esri Gray': esriGray,
          'MapQuest Open': mqOpen,
          'MapQuest Open Aerial': mqAerial,
          'Bing Road': bingRoad,
          'Bing Hybrid': bingHybrid,
          'Bing Aerial': bingAerial
        };

        var overlayLayers = {
          'Regional Water Planning Areas': planningAreas,
          'Texas Counties': counties,
          'Texas County Names': countyLabels,
          'Texas Senate Districts (2011)': senateDistricts,
          'Texas House Districts (2011)': houseDistricts
        };

        //Start with esriGray and planningAreas selected
        esriGray.addTo(map);
        planningAreas.addTo(map);

        //Add controls
        L.control.layers(baseMaps, overlayLayers).addTo(map);
      }

      function _setupRegionLayer(scope) {
        var regionFeats = omnivore.topojson.parse(
          ISWP_VARS.regionsTopo);

        var regionLayer = L.geoJson(regionFeats, {
          style: {
            stroke: false,
            color: '#ffcc00',
            weight: 3,
            opacity: 1,
            fillOpacity: 0
          },
          onEachFeature: function (feature, layer) {
            layer.on('click', function () {
              //TODO: Use current subtheme
              $location.path('/needs/' +
                $routeParams.year + '/' +
                layer.feature.properties.region);
              scope.$apply();
            });
            
            layer.on('mouseover', function () {
              layer.setStyle({
                stroke: true
              });
            });

            layer.on('mouseout', function () {
              layer.setStyle({
                stroke: false
              });
            });
          }
        });

        return regionLayer;
      }

      return {
        template: '<div></div>',
        restrict: 'AE',
        scope: {
          showRegions: '=',
          zoom: '=',
          centerLat: '=',
          centerLng: '='
        },
        link: function postLink(scope, element, attrs) {
          var map = L.map(element[0], {
              center: [scope.centerLat, scope.centerLng],
              zoom: scope.zoom,
              attributionControl: false
            });

          //Use attribution control without 'Leaflet' prefix
          L.control.attribution({prefix: false}).addTo(map);

          var updateHash = _.debounce(function() {
            var center = map.getCenter(),
                zoom = map.getZoom(),
                precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2)),
                latLng = ''+[center.lat.toFixed(precision), 
                  center.lng.toFixed(precision)];

            $location.search({
              zoom: zoom,
              center: latLng
            });

            scope.$apply();
          }, 250, {trailing: true});

          map.on('moveend', updateHash);

          _setupLayers(map);

          if (scope.showRegions) {
            var regionLayer = _setupRegionLayer(scope);
            regionLayer.addTo(map);
          }
        }
      };
    }
  );
