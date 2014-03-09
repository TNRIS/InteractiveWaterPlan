/* global omnivore */
'use strict';

angular.module('iswpApp')
  .directive('mainMap',
    function ($log, RegionService, BING_API_KEY, SWP_WMS_URL, ISWP_VARS) {

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

      return {
        template: '<div></div>',
        restrict: 'AE',
        link: function postLink(scope, element, attrs) {
          var map = L.map(element[0], {
              center: [31.780548049237414, -99.02290684869513],
              zoom: 5,
              attributionControl: false
            });

          L.control.attribution({prefix: false}).addTo(map);

          _setupLayers(map);

          scope.$watch('RegionService.showRegions', function() {
            console.log("showRegions", RegionService.showRegions);
          });
        }
      };
    }
  );
