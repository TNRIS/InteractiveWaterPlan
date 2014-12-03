'use strict';

//Service create basemap layers for a Leaflet map
angular.module('iswpApp').factory('MapLayerService',
  function MapLayerService($state, $stateParams, RegionService, SWP_WMS_URL, TILES_URL, REGION_STYLE) {
    var service = {};

    var regionFeatureLayer;

    service.setupBaseLayers = function(map) {
      // Base Layers
      var esriGray = L.esri.basemapLayer("Gray");

      var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://cartodb.com/attributions#basemaps">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.'
      });

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

      // Overlay Layers
      var regions = L.tileLayer(TILES_URL + '/rwpas/{z}/{x}/{y}.png', {
        opacity: 0.6,
        subdomains: '123'
      });

      var rwpd_teams = L.tileLayer(TILES_URL + '/rwpd-teams/{z}/{x}/{y}.png', {
        opacity: 0.9,
        subdomains: '123'
      });

      var counties = L.tileLayer(TILES_URL + '/counties-outlines/{z}/{x}/{y}.png', {
        subdomains: '123'
      });

      var countyLabels = L.tileLayer(TILES_URL + '/counties-labels/{z}/{x}/{y}.png', {
        subdomains: '123'
      });

      var senateDistricts = L.tileLayer(TILES_URL + '/texas-senate-districts/{z}/{x}/{y}.png', {
        opacity: 0.6,
        subdomains: '123'
      });

      var houseDistricts = L.tileLayer(TILES_URL + '/texas-house-districts/{z}/{x}/{y}.png', {
        opacity: 0.6,
        subdomains: '123'
      });

      var publicWaterSystems = L.tileLayer(TILES_URL + '/public-water-systems/{z}/{x}/{y}.png', {
        opacity: 0.6,
        subdomains: '123'
      });

      var grayWithLabels = L.layerGroup([esriGray, countyLabels]);

      service.baseMaps = {
        'CartoDB Light': positron,
        'Esri Gray': grayWithLabels,
        'MapQuest Open': mqOpen,
        'MapQuest Open Aerial': mqAerial
      };

      service.overlayLayers = {
        'Regional Water Planning Areas': regions,
        'Regional Water Planning District Teams': rwpd_teams,
        'Texas Counties': counties,
        'Texas County Names': countyLabels,
        'Texas Senate Districts (2013-14)': senateDistricts,
        'Texas House Districts (2013-14)': houseDistricts,
        'Public Water Systems': publicWaterSystems
      };

      //Start with positron and regions selected
      positron.addTo(map);
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

      //turn off the stroke for each region feature
      // otherwise it can get 'stuck' on
      regionFeatureLayer.eachLayer(function(lyr) {
        lyr.setStyle({stroke: false});
      });

    };

    service.removeRegions = function(map) {
      if (map.hasLayer(regionFeatureLayer)) {
        map.removeLayer(regionFeatureLayer);
      }
    };

    return service;
  });
