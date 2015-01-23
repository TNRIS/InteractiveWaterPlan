'use strict';

angular.module('iswpApp').controller('DemandsEntityCtrl',
  function ($scope, demandsData, entitySummary, ChartService, EntityService, HeadingService, ENTITY_TABLE_COLS, API_PATH) {
    //if entitySummary is null then this was called for an invalid entityId
    // so return to home view
    if (!entitySummary) {
      $scope.$state.go('^.summary', {year: '2010'});
      return;
    }

    var entityId = $scope.$stateParams.entityId;
    var entity = EntityService.getEntity(entityId);
    var entityName = entity.EntityName;

    HeadingService.current = entityName;
    $scope.mapDescription = 'Map displays <strong>' + entityName + '</strong>.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists projected water demands of <strong>'+ entityName + '</strong> in {year}.';
    var chartDescTpl = 'Graph displays a summary of: Projected Water Demands, Existing Water Supplies, Identified Water Need, and Recommended Strategy Supply of <strong>'+ entityName + '</strong> in {year}.';

    $scope.downloadPath = API_PATH + 'demands/entity/' + entityId + '?format=csv';

    var demandsCol = {
      map: 'D2010',
      label: 'Demand (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = ENTITY_TABLE_COLS.concat(demandsCol);

    //override the tableConfig from WrapCtrl
    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    $scope.tableRows = demandsData;

    $scope.chartSelect = function (selectedItem) {
      var rowId = $scope.chartConfig.data[selectedItem.row+1][4];
      $scope.$state.go(rowId + '.entity', $scope.$stateParams);
    };

    $scope.$on('$stateChangeSuccess', function() {
      var year = $scope.currentYear;
      $scope.tableDescription = tableDescTpl.assign({year: year});
      $scope.chartDescription = chartDescTpl.assign({year: year});

      $scope.chartConfig = ChartService.buildEntityChartConfig(entitySummary, year);

      demandsCol.map = 'D' + year;
    });
  }
);
