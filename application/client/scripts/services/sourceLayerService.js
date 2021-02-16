'use strict';

angular.module('iswpApp').factory('SourceLayerService',
  function ($http, $state, $stateParams, MAPSERVER_SOURCE_URL, MAPSERVER_POLY_TILES, MAPSERVER_LINE_TILES, MAPSERVER_POINT_TILES) {

    var service = {};

    service.getBounds = function getBounds(sourceIds) {
      var sourceSuffix = '&SourceIds=' + sourceIds.toString();
      var rootUrls = [
        MAPSERVER_SOURCE_URL + '&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=PolygonSources&outputformat=geojson&SRSNAME=EPSG:4326' + sourceSuffix,
        MAPSERVER_SOURCE_URL + '&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=LineSources&outputformat=geojson&SRSNAME=EPSG:4326' + sourceSuffix,
        MAPSERVER_SOURCE_URL + '&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=PointSources&outputformat=geojson&SRSNAME=EPSG:4326' + sourceSuffix
      ];

      var promises = rootUrls.map(function (url) {
        return $http.get(url).then(function(response) {
          return response.data.features;
        });

      });

      return Promise.all(promises).then(function(feats) {
        var features = [].concat(feats[0], feats[1], feats[2]);
        var geojson = {
          "type": "FeatureCollection",
          "name": "Sources",
          "features": features
        };
        return L.featureGroup([L.geoJson(geojson)]).getBounds();
      });
    };

    service.createLayer = function createLayer(sourceIds, map) {

      var rootUrls = [
        MAPSERVER_SOURCE_URL + MAPSERVER_POLY_TILES,
        MAPSERVER_SOURCE_URL + MAPSERVER_LINE_TILES,
        MAPSERVER_SOURCE_URL + MAPSERVER_POINT_TILES
      ];

      var promises = rootUrls.map(function (url) {
          var tileLayer = L.tileLayer(url + 'png&SourceIds=' + sourceIds.toString());
          var utfGridLayer = L.utfGrid(
            url + 'utfgrid&SourceIds=' + sourceIds.toString(), {
            useJsonP: false
          });

          var label;
          utfGridLayer.on('mousemove', function (e) {
            if (!label) {
              label = new L.Label({className: 'sourceLabel'});
            }
            label.setContent(e.data.name);
            label.setLatLng(e.latlng);
            if (!map.hasLayer(label)) {
              map.addLayer(label);
            }
          });

          utfGridLayer.on('mouseout', function () {
            if (label && map.hasLayer(label)) {
              map.removeLayer(label);
              label = null;
            }
          });

          utfGridLayer.on('click', function (e) {
            if (!e || !e.data) {
              return;
            }

            $state.go('^.source', {
              year: $stateParams.year,
              sourceId: e.data.sourceid
            });
            return;
          });
        

          var sourceLayerGroup = L.featureGroup([tileLayer, utfGridLayer]);
          map.addLayer(sourceLayerGroup);
          sourceLayerGroup.bringToFront();

          //make sure this layer is always on top of other tile layers
          var bringSourceLayerToFront = function () {
            sourceLayerGroup.bringToFront();
          };
          map.on('layeradd', bringSourceLayerToFront);

          //remove the layeradd listener when the source layer is removed
          var origOnRemove = sourceLayerGroup.onRemove;
          sourceLayerGroup.onRemove = function (map) {
            map.off('layeradd', bringSourceLayerToFront);
            origOnRemove.call(sourceLayerGroup, map);
          };

          return sourceLayerGroup;
      });
        
      return Promise.all(promises);
    };

    return service;
  }
);
