'use strict';

angular.module('iswpApp').controller('SuppliesRegionCtrl',
  function ($scope, $rootScope, suppliesData, HeadingService, REGION_TABLE_COLS, API_PATH) {

    var region = $scope.$stateParams.region.toUpperCase();

    HeadingService.current =  'Region ' + region;

    $scope.mapDescription = 'Map displays water user groups in <strong>Region ' + region + '</strong> and the relative volumes of their projected existing water supplies and associated water sources (water system service area boundaries may extend outside of region). <strong>Click</strong> on a dot to view sources of water for that entity.';

    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' existing water supply within <strong>Region ' + region + '</strong> in {year}';

    $scope.downloadPath = API_PATH + 'supplies/region/' + region + '?format=csv';

    var existingSupplyCol = {
      map: 'WS2010',
      label: 'Existing Water Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    var sourceCol = {
      map: 'SourceName',
      label: 'Source',
      headerClass: 'text-center',
      cellTemplateUrl: 'templates/linkcell.html'
    };

    $scope.tableColumns = REGION_TABLE_COLS.concat([sourceCol, existingSupplyCol]);

    $scope.tableRows = suppliesData;

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});
      existingSupplyCol.map = 'WS' + $scope.currentYear;
    });
  });
