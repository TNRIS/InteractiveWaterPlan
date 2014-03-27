'use strict';

//Service create basemap layers for a Leaflet map
angular.module('iswpApp')
  .constant('REGION_STYLE', {
    stroke: false,
    color: '#ffcc00',
    weight: 3,
    opacity: 1,
    fillOpacity: 0
  })
  .factory('MapLayerService',
    function MapLayerService($state, $stateParams, RegionService, BING_API_KEY,
      SWP_WMS_URL, TILES_URL, REGION_STYLE) {
      var service = {};

      var regionFeatureLayer;

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
        var regions = L.tileLayer(TILES_URL + '/rwpas/{z}/{x}/{y}.png', {
          opacity: 0.6
        });

        var counties = L.tileLayer(TILES_URL + '/counties-outlines/{z}/{x}/{y}.png');

        var countyLabels = L.tileLayer(TILES_URL + '/counties-labels/{z}/{x}/{y}.png');

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

        var publicWaterSystems = L.tileLayer(TILES_URL + '/public-water-systems/{z}/{x}/{y}.png', {
          opacity: 0.6
        });

        var grayWithLabels = L.layerGroup([esriGray, countyLabels]);

        service.baseMaps = {
          'Esri Gray': grayWithLabels,
          'MapQuest Open': mqOpen,
          'MapQuest Open Aerial': mqAerial,
          'Bing Road': bingRoad,
          'Bing Hybrid': bingHybrid,
          'Bing Aerial': bingAerial
        };

        service.overlayLayers = {
          'Regional Water Planning Areas': regions,
          'Texas Counties': counties,
          'Texas County Names': countyLabels,
          'Texas Senate Districts (2013-14)': senateDistricts,
          'Texas House Districts (2013-14)': houseDistricts,
          'Public Water Systems': publicWaterSystems
        };

        //Start with grayWithLabels and regions selected
        grayWithLabels.addTo(map);
        regions.addTo(map);

        //Add controls
        L.control.layers(service.baseMaps, service.overlayLayers).addTo(map);
      };


      service.setupRegionLayer = function() {
        var regionFeats = RegionService.regionFeatures;

        regionFeatureLayer = L.geoJson(regionFeats, {
          style: REGION_STYLE,
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

        return regionFeatureLayer;
      };

      service.showRegions = function(map) {
        var regionOverlayLayer = service.overlayLayers[
          'Regional Water Planning Areas'];
        if (!map.hasLayer(regionFeatureLayer)) {
          regionFeatureLayer.addTo(map);
        }
        if (!map.hasLayer(regionOverlayLayer)) {
          regionOverlayLayer.addTo(map);
        }


      };

      service.removeRegions = function(map) {
        if (map.hasLayer(regionFeatureLayer)) {
          map.removeLayer(regionFeatureLayer);
        }
      };

      return service;
    }
  );
