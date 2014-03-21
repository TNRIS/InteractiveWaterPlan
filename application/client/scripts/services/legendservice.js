'use strict';

//Service create basemap layers for a Leaflet map
angular.module('iswpApp')
  .factory('LegendService', function LegendService() {
    var service = {};

    service.Needs = {
      entityColors: [
        {limit: 0, color: '#1A9641'}, //green
        {limit: 10, color: '#A6D96A'},
        {limit: 25, color: '#FFFFBF'},
        {limit: 50, color: '#FDAE61'},
        {limit: 100, color: '#D7191C'} //red
      ],

      createLegend: function() {
        var legend = L.control({
          position: 'bottomleft'
        });

        legend.onAdd = function(map) {
          this._div = L.DomUtil.create('div', 'leaflet-legend legend-needs hidden-xs');
          this._update();
          this.isAdded = true;
          return this._div;
        };

        legend.onRemove = function() {
          this.isAdded = false;
        };

        legend._update = function() {
          L.DomUtil.create('h4', '', this._div)
            .innerHTML = 'Need as a % of Demand';

          var ul = L.DomUtil.create('ul', '', this._div),
            circleTpl = '<svg height="14" width="14">' +
              '<circle cx="7" cy="7" r="6" stroke="black" stroke-width="1" fill="{color}">' +
              '</svg>',
            tpl = '<span class="lower-bound">{lowerBound}% &lt; </span>' + circleTpl + ' &le; {upperBound}%';

          for (var i = service.Needs.entityColors.length - 1; i >= 0; i--) {
            var colorEntry = service.Needs.entityColors[i],
              prevColorEntry = service.Needs.entityColors[i-1],
              legendEntry = L.DomUtil.create('li', 'legend-entry', ul);

            if (colorEntry.limit === 0) {
              legendEntry.innerHTML = '<span class="lower-bound"></span>' +
                circleTpl.assign({color: colorEntry.color}) + ' = No Need';
            }
            else {
              legendEntry.innerHTML = tpl.assign({
                color: colorEntry.color,
                upperBound: colorEntry.limit,
                lowerBound: prevColorEntry ? prevColorEntry.limit : 0
              });
            }
          }
        };

        return legend;
      }

    };

    return service;
  });
