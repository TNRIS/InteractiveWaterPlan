'use strict';

angular.module('iswpApp').factory('SourceLayerService',
  function ($http, API_PATH, CARTODB_URL, CARTODB_SOURCE_TBL, SOURCE_CARTOCSS) {

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
        if (!result) { return null; }
        var boxStr = result.extent.remove('BOX(').remove(')');
        var boundsPoints = boxStr.split(/\s|,/).map(parseFloat);
        return L.latLngBounds([boundsPoints[1], boundsPoints[0]],
          [boundsPoints[3], boundsPoints[2]]);
      });

      return prom;
    };

    service.getMappingPoints = function getMappingPoints(sourceIds) {
      var requestPath = API_PATH + "sources/points?ids=";
      requestPath += sourceIds.join(",");
      return $http.get(requestPath).then(function (results) {
        return results.data;
      });
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
            if (!e || !e.data) { return; }
            console.log('utf click', e.data);
          });

          var layerGroup = L.featureGroup([tileLayer, utfGridLayer]);
          map.addLayer(layerGroup);
          layerGroup.bringToFront();
          return layerGroup;
        });

      return prom;
    };

    return service;
  }
);
