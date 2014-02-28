'use strict';

angular.module('iswpApp')
  .directive('mainMap', function ($log) {
    return {
      template: '<div></div>',
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        var map = L.map(element[0], {
            center: [31.780548049237414, -99.02290684869513],
            zoom: 5
          });

        L.tileLayer(
          'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
          name: 'MapQuest Open',
          subdomains: ['otile1', 'otile2', 'otile3', 'otile4'],
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
              '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.' +
              'Tiles courtesy MapQuest <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>',
          isBaseLayer: true
        }).addTo(map);

      }
    };
  });
