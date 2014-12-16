'use strict';

angular.module('iswpApp').controller('StrategiesRegionCtrl',
  function ($scope, $rootScope, strategiesData, HeadingService, WMS_TABLE_ADDL_COLS, REGION_TABLE_COLS, API_PATH) {

    var region = $scope.$stateParams.region.toUpperCase();

    HeadingService.current =  'Region ' + region;

    $scope.mapDescription = 'Map displays water user groups with recommended water management strategy supplies in <strong>Region ' + region + '</strong> and associated water sources (water system service area boundaries may extend outside of region). <strong>Click</strong> on a dot to view sources of water for that entity.';

    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' recommended strategy supplies within <strong>Region ' + region + '</strong> in {year}';

    $scope.downloadPath = API_PATH + 'strategies/region/' + region + '?format=csv';

    var strategySupplyCol = {
      map: 'SS2010',
      label: 'Recommended Strategy Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = REGION_TABLE_COLS.concat(WMS_TABLE_ADDL_COLS).concat(strategySupplyCol);

    $scope.tableRows = strategiesData;

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});
      strategySupplyCol.map = 'SS' + $scope.currentYear;
    });
  });
