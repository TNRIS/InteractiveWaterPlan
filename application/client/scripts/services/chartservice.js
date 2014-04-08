'use strict';

angular.module('iswpApp')
  .factory('ChartService', function ChartService($http, API_PATH, ISWP_VARS) {
    var service = {};


    service.buildEntityChartConfig = function(entitySummary, year) {

      console.log("here");

      var demand = entitySummary['D'+ year],
          supply = entitySummary['WS'+ year],
          needs = entitySummary['N'+ year],
          strategySupply = entitySummary['SS'+ year];

      var chartConfig = {
          type: 'ColumnChart',
          options: {
            legend: 'none',
            fontName: '"Open Sans", Arial, "sans serif"',
            vAxis: {
              title: 'acre-feet/year',
              titleTextStyle: {
                italic: false
              },
              minValue: 0
            }
          },
          data: [
            ['Category', 'Amount (acre-ft/year)', {role: 'style'}, {role: 'tooltip'}],
            ['Water Demand', demand, '#666', demand.format() + ' acre-feet/year'],
            ['Existing Water Supply', supply, '#007fff', supply.format() + ' acre-feet/year'],
            ['Water Need', needs, '#aa0000', needs.format() + ' acre-feet/year'],
            ['Strategy Supply', strategySupply, '#ff7518', strategySupply.format() + ' acre-feet/year'],
          ]
        };

      return chartConfig;
    };

    return service;
  });
