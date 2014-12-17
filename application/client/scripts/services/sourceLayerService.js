'use strict';

angular.module('iswpApp').factory('SourceLayerService',
  function ($http, $state, $stateParams, API_PATH, CARTODB_URL, CARTODB_SOURCE_TBL, SOURCE_CARTOCSS) {

    var service = {};

    service.getBounds = function getBounds(sourceIds) {
      var sql = "select ST_Extent(the_geom) as extent from {table} " +
        "where sourceid in ({sourceIds}) limit 1";
      sql = sql.assign({
        table: CARTODB_SOURCE_TBL,
        sourceIds: sourceIds.join(",")
      });

      var sqlApiUrl = CARTODB_URL + 'v2/sql';
      sqlApiUrl = sqlApiUrl + "?q=" + sql;

      var prom = $http.get(sqlApiUrl).then(function (response) {
        var result = _.first(response.data.rows);
        if (!result || !result.extent) {
          return null;
        }
        var boxStr = result.extent.remove('BOX(').remove(')');
        var boundsPoints = boxStr.split(/\s|,/).map(parseFloat);
        return L.latLngBounds([boundsPoints[1], boundsPoints[0]],
          [boundsPoints[3], boundsPoints[2]]);
      });

      return prom;
    };

    service.createLayer = function createLayer(sourceIds, map) {
      var sql = "select * from {table} where sourceid in ({sourceIds}) " +
        "order by drawingorder";
      sql = sql.assign({
        table: CARTODB_SOURCE_TBL,
        sourceIds: sourceIds.join(",")
      });

      var mapConfig = {
        version: "1.0.1",
        layers: [{
          type: "cartodb",
          options: {
            cartocss_version: "2.1.1",
            sql: sql,
            cartocss: SOURCE_CARTOCSS,
            interactivity: ['name', 'sourceid']
          }
        }]
      };

      var mapApiUrl = CARTODB_URL + 'v1/map/';

      var prom = $http.post(mapApiUrl, mapConfig)
        .then(function (response) {
          var layerid = response.data.layergroupid;
          var zxy = "/{z}/{x}/{y}";
          var tileLayer = L.tileLayer(mapApiUrl + layerid + zxy + ".png");
          var utfGridLayer = L.utfGrid(
            mapApiUrl + layerid + "/0" + zxy + ".grid.json", {
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

      return prom;
    };

    return service;
  }
);
