'use strict';

angular.module('iswpApp')
  .controller('NeedsEntityTableCtrl', function ($scope, needsData, entitySummary, EntityService) {

    var entityId = $scope.$stateParams.entityId,
      entity = EntityService.getEntity(entityId),
      entityName = entity.EntityName;

    console.log("entitySummary", entitySummary);

    $scope.heading = '' + entityName;
    $scope.mapDescription = 'Map displays <strong>' + entityName + '</strong>.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists identified water needs of <strong>'+ entityName + '</strong> in {year}.';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/yr)',
      cellClass: 'number',
      formatFunction: 'number'
    };

    var percentCol = {
      map: 'NPD2010',
      label: 'Overall Entity Need as % of Demand*',
      cellClass: 'percent',
      formatFunction: function(val) { return '' + val + '%'; }
    };

    var cellTemplateUrl = 'partials/needs/needs_link_cell.html';

    $scope.tableColumns = [
      {map: 'EntityName', label: 'Name'},
      {map: 'WugRegion', label: 'Region', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugCounty', label: 'County', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugType', label: 'Entity Type', cellTemplateUrl: cellTemplateUrl},
      needsCol,
      percentCol
    ];

    $scope.tableConfig = {
      isPaginationEnabled: true,
      itemsByPage: 20 //TODO: Make user-changeable
    };

    $scope.tableRows = needsData;

    //Method to build the chartConfig object for google-chart directive
    var buildChart = function(year) {
      var demand = entitySummary['D'+ year],
          supply = entitySummary['WS'+ year],
          needs = entitySummary['N'+ year],
          strategySupply = entitySummary['SS'+ year];

      var chartConfig = {
          type: 'ColumnChart',
          //formatters: 'number'
          options: {
            legend: 'none',
            vAxis: {
              title: 'acre-feet/yr',
              titleTextStyle: {
                italic: false
              }
            }
          },
          data: [
            ['Category', 'Amount (acre-ft/yr)', {role: 'style'}, {role: 'tooltip'}],
            ['Water Demand', demand, '#9954bb', demand.format() + ' acre-feet/yr'],
            ['Water Supply', supply, '#007fff', supply.format() + ' acre-feet/yr'],
            ['Water Need', needs, '#ff0039', needs.format() + ' acre-feet/yr'],
            ['Strategy Supply',strategySupply, '#ff7518', strategySupply.format() + ' acre-feet/yr'],
          ]
        };

      return chartConfig;
    };

    //TODO: Remember the sort order when changing Year

    $scope.$on('$stateChangeSuccess', function() {
      var year = $scope.currentYear = $scope.$stateParams.year;
      $scope.tableDescription = tableDescTpl.assign({year: year});

      $scope.chartConfig = buildChart(year);

      needsCol.map = 'N' + year;
      percentCol.map = 'NPD' + year;

    });
    return;
  });
