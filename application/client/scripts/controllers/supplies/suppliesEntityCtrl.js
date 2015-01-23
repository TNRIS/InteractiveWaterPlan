'use strict';

angular.module('iswpApp').controller('SuppliesEntityCtrl',
  function ($scope, suppliesData, entitySummary, ChartService, EntityService, HeadingService, ENTITY_TABLE_COLS, API_PATH) {
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
    $scope.mapDescription = 'Map displays the projected existing water supplies of <strong>' + entityName + '</strong> and associated sources of water.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists projected existing water supplies of <strong>'+ entityName + '</strong> in {year}.';
    var chartDescTpl = 'Graph displays a summary of: Projected Water Demands, Existing Water Supplies, Identified Water Need, and Recommended Strategy Supply of <strong>'+ entityName + '</strong> in {year}.';

    $scope.downloadPath = API_PATH + 'supplies/entity/' + entityId + '?format=csv';

    var sourceCol = {
      map: 'SourceName',
      label: 'Source',
      headerClass: 'text-center',
      cellTemplateUrl: 'templates/linkcell.html'
    };

    var suppliesCol = {
      map: 'WS2010',
      label: 'Existing Water Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };


    $scope.tableColumns = ENTITY_TABLE_COLS.concat([sourceCol, suppliesCol]);

    //override the tableConfig from WrapCtrl
    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    $scope.tableRows = suppliesData;

    $scope.chartSelect = function (selectedItem) {
      var rowId = $scope.chartConfig.data[selectedItem.row+1][4];
      $scope.$state.go(rowId + '.entity', $scope.$stateParams);
    };

    $scope.$on('$stateChangeSuccess', function() {
      var year = $scope.currentYear;
      $scope.tableDescription = tableDescTpl.assign({year: year});
      $scope.chartDescription = chartDescTpl.assign({year: year});

      $scope.chartConfig = ChartService.buildEntityChartConfig(entitySummary, year);

      suppliesCol.map = 'WS' + year;
    });

  }
);
