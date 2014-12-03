'use strict';

angular.module('iswpApp')
  .factory('ChartService', function ChartService($http, DATA_VALUE_PREFIXES, API_PATH, ISWP_VARS) {
    var service = {};

    service.buildEntityChartConfig = function (entitySummary, year) {
      var demand = entitySummary[DATA_VALUE_PREFIXES.demands + year],
          supply = entitySummary[DATA_VALUE_PREFIXES.supplies + year],
          needs = entitySummary[DATA_VALUE_PREFIXES.needs + year],
          strategySupply = entitySummary[DATA_VALUE_PREFIXES.strategies + year];

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
            ['Category', 'Amount (acre-ft/year)', {role: 'style'}, {role: 'tooltip'}, {role: 'id'}],
            ['Water Demand', demand, '#0AC763', demand.format() + ' acre-feet/year', 'demands'],
            ['Existing Water Supply', supply, '#007fff', supply.format() + ' acre-feet/year', 'existing'],
            ['Water Need', needs, '#aa0000', needs.format() + ' acre-feet/year', 'needs'],
            ['Strategy Supply', strategySupply, '#ff7518', strategySupply.format() + ' acre-feet/year', 'strategy'],
          ]
        };

      return chartConfig;
    };

    return service;
  });
