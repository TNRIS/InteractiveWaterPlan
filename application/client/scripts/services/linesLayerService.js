'use strict';

angular.module('iswpApp').factory('LinesLayerService', function(LINE_STYLE) {

  var service = {};

  function quadratic_bezier(a, b, c, t) {
    var it = 1 - t;
    return (a * it + b * t) * it + (b * it + c * t) * t;
  }

  //start and end are L.LatLng instances
  function curvedLine(start, end) {
    var distance = L.point(start.lng, start.lat).distanceTo(L.point(end.lng, end.lat));
    var arcHeight = distance/4;
    var skew  = start.lng > end.lng ? -1 * distance/4 : distance/4;
    var midY = (end.lat + start.lat)/2;
    var midX = (end.lng + start.lng)/2;

    if (Math.abs(start.lat - end.lat) < 0.0001) {
      midX -= arcHeight;
      midY += skew;
    }
    else {
      midY += arcHeight;
      midX += skew;
    }

    var numSegments = 80;

    var points = [start];

    for (var t = 0; t < 1; t = t + 1/numSegments) {
      var lat = quadratic_bezier(start.lat, midY, end.lat, t);
      var lng = quadratic_bezier(start.lng, midX, end.lng, t);

      points.push(L.latLng([lat, lng]));
    }

    points.push(end);

    return L.polyline(points, LINE_STYLE);
  }

  service.createLinesLayer = function createLinesLayer(entities, currentData, sourceMappingPoints) {

    var lines = [];

    _.each(sourceMappingPoints, function (sourceMp) {

      _(currentData).where(function (row) {
        return row.MapSourceId === sourceMp.id;
      }).map(function (row) {
        return _.find(entities, {EntityId: row.EntityId});
      })
        .compact()
        .each(function (entity) {
        var start = L.latLng([entity.Latitude, entity.Longitude]);
        var end = L.latLng([sourceMp.mappingPoint.coordinates[1],
          sourceMp.mappingPoint.coordinates[0]]);
        lines.push(curvedLine(start, end));
        return;
      });

      return;
    });

    return L.featureGroup(lines);
  };

  return service;
});
