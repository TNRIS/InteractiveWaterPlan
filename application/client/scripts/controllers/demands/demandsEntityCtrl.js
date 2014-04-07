'use strict';

angular.module('iswpApp')
  .controller('DemandsEntityCtrl', function ($scope, demandsData, entitySummary, EntityService, API_PATH) {

    //if entitySummary is null then this was called for an invalid entityId
    // so return to home view
    if (!entitySummary) {
      $scope.$state.go('demands.summary', {year: '2010'});
      return;
    }

    var entityId = $scope.$stateParams.entityId,
      entity = EntityService.getEntity(entityId),
      entityName = entity.EntityName;

    $scope.heading = '' + entityName;
    $scope.mapDescription = 'Map displays <strong>' + entityName + '</strong>.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists projected water demands of <strong>'+ entityName + '</strong> in {year}.';
    var chartDescTpl = 'Graph displays a summary of: Projected Water Demands, Existing Water Supplies, Identified Water Need, and Recommended Strategy Supply of <strong>'+ entityName + '</strong> in {year}.';

    $scope.downloadPath = API_PATH + 'demands/entity/' + entityId + '?format=csv';

    var demandsCol = {
      map: 'D2010',
      label: 'Demand (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number'
    };

    var cellTemplateUrl = 'partials/linkcell.html';

    $scope.tableColumns = [
      {map: 'EntityName', label: 'Name'},
      {map: 'WugRegion', label: 'Region', cellClass: 'text-center', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugCounty', label: 'County', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugType', label: 'Entity Type', cellTemplateUrl: cellTemplateUrl},
      demandsCol
    ];

    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    $scope.tableRows = demandsData;

    //Method to build the chartConfig object for google-chart directive
    var buildChart = function(year) {
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
            ['Strategy Supply',strategySupply, '#ff7518', strategySupply.format() + ' acre-feet/year'],
          ]
        };

      return chartConfig;
    };

    //TODO: Remember the sort order when changing Year

    $scope.$on('$stateChangeSuccess', function() {
      var year = $scope.currentYear = $scope.$stateParams.year;
      $scope.tableDescription = tableDescTpl.assign({year: year});
      $scope.chartDescription = chartDescTpl.assign({year: year});

      $scope.chartConfig = buildChart(year);

      demandsCol.map = 'D' + year;
    });

    return;
  });
