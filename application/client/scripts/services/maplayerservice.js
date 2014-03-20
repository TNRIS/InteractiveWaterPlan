'use strict';

//Service create basemap layers for a Leaflet map
angular.module('iswpApp')
  .service('MapLayerService',
    function MapLayerService($state, $stateParams, RegionService, BING_API_KEY, SWP_WMS_URL, TILES_URL) {
      var service = {};

      service.setupBaseLayers = function(map) {
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

        var bingRoad = L.bingLayer(BING_API_KEY, {
          type: 'Road'
        });

        var bingHybrid = L.bingLayer(BING_API_KEY, {
          type: 'AerialWithLabels'
        });

        var bingAerial = L.bingLayer(BING_API_KEY, {
          type: 'Aerial'
        });

        // Overlay Layers
        var planningAreas = L.tileLayer(TILES_URL + '/rwpas/{z}/{x}/{y}.png', {
          opacity: 0.6
        });

        var counties = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '1,9',
          format: 'image/png',
          transparent: true,
          opacity: 0.6
        });

        var countyLabels = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '9',
          format: 'image/png',
          transparent: true
        });

        var senateDistricts = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '3,13',
          format: 'image/png',
          transparent: true,
          opacity: 0.6
        });

        var houseDistricts = L.tileLayer.wms(SWP_WMS_URL, {
          layers: '2,11',
          format: 'image/png',
          transparent: true,
          opacity: 0.6
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
      };

      service.setupRegionLayer = function() {
        var regionFeats = RegionService.regionFeatures;

        var regionLayer = L.geoJson(regionFeats, {
          style: {
            stroke: false,
            color: '#ffcc00',
            weight: 3,
            opacity: 1,
            fillOpacity: 0
          },
          onEachFeature: function (feature, layer) {
            //add leaflet-label (from plugin)
            layer.bindLabel("Region "+layer.feature.properties.region);

            //view data for region on click
            layer.on('click', function () {
              $state.go('^.region', {
                region: layer.feature.properties.region,
                year: $stateParams.year
              });
            });

            //highlight on mouseover
            layer.on('mouseover', function () {
              layer.setStyle({
                stroke: true
              });
            });

            //unhighlight on mouseout
            layer.on('mouseout', function () {
              layer.setStyle({
                stroke: false
              });
            });
          }
        });

        return regionLayer;
      };

      return service;
    }
  );