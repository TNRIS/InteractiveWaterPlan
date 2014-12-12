'use strict';

angular.module('iswpApp').controller('SuppliesRegionCtrl',
  function ($scope, $rootScope, suppliesData, HeadingService, REGION_TABLE_COLS, API_PATH) {

    var region = $scope.$stateParams.region.toUpperCase();

    HeadingService.current =  'Region ' + region;

    $scope.mapDescription = 'Map displays water user groups with projected existing water supplies in <strong>Region ' + region + '</strong> and associated water sources (water system service area boundaries may extend outside of region). <strong>Click</strong> on a dot to view sources of water for that entity.';

    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' existing water supply within <strong>Region ' + region + '</strong> in {year}';

    $scope.downloadPath = API_PATH + 'supplies/region/' + region + '?format=csv';

    var strategySupplyCol = {
      map: 'WS2010',
      label: 'Existing Water Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = REGION_TABLE_COLS.concat(strategySupplyCol);

    $scope.tableRows = suppliesData;

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});
      strategySupplyCol.map = 'WS' + $scope.currentYear;
    });
  });
