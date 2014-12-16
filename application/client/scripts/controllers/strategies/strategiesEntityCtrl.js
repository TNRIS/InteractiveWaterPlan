'use strict';

angular.module('iswpApp').controller('StrategiesEntityCtrl',
  function ($scope, strategiesData, entitySummary, ChartService, EntityService, HeadingService, ENTITY_TABLE_COLS, WMS_TABLE_ADDL_COLS, API_PATH) {
    //if entitySummary is null then this was called for an invalid entityId
    // so return to home view
    if (!entitySummary) {
      $scope.$state.go('^.summary', {year: '2010'});
      return;
    }

    var entityId = $scope.$stateParams.entityId;
    var entity = EntityService.getEntity(entityId);
    var entityName = entity.EntityName;

    HeadingService.current =  entityName;
    $scope.mapDescription = 'Map displays <strong>' + entityName + '</strong> with recommended water management strategy supplies and associated sources of water.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists recommended water management strategy supplies for <strong>'+ entityName + '</strong> in {year}.';
    var chartDescTpl = 'Graph displays a summary of: Projected Water Demands, Existing Water Supplies, Identified Water Need, and Recommended Strategy Supply of <strong>'+ entityName + '</strong> in {year}.';

    $scope.downloadPath = API_PATH + 'strategies/entity/' + entityId + '?format=csv';


    var strategiesCol = {
      map: 'SS2010',
      label: 'Recommended Strategy Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = ENTITY_TABLE_COLS.concat(WMS_TABLE_ADDL_COLS).concat(strategiesCol);

    //override the tableConfig from WrapCtrl
    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    $scope.tableRows = strategiesData;

    $scope.chartSelect = function (selectedItem) {
      var rowId = $scope.chartConfig.data[selectedItem.row+1][4];
      $scope.$state.go(rowId + '.entity', $scope.$stateParams);
    };

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      var year = $scope.currentYear;
      $scope.tableDescription = tableDescTpl.assign({year: year});
      $scope.chartDescription = chartDescTpl.assign({year: year});

      $scope.chartConfig = ChartService.buildEntityChartConfig(entitySummary, year);

      strategiesCol.map = 'SS' + year;
    });

  }
);
