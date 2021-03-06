'use strict';

angular.module('iswpApp').controller('StrategiesCountyCtrl',
  function ($scope, $rootScope, strategiesData, HeadingService, COUNTY_TABLE_COLS, WMS_TABLE_ADDL_COLS, API_PATH) {

    var county = $scope.$stateParams.county.titleize();

    HeadingService.current =  county + ' County';
    $scope.mapDescription = 'Map displays water user groups with recommended water management strategy supplies within <strong>' + county + ' County</strong> and associated sources of water (water system service area boundaries may extend outside of county).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' recommended strategy supply within <strong>' + county + ' County</strong> in {year}.';

    $scope.downloadPath = API_PATH + 'strategies/county/' + county + '?format=csv';

    var strategiesCol = {
      map: 'SS2010',
      label: 'Recommended Strategy Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = COUNTY_TABLE_COLS.concat(WMS_TABLE_ADDL_COLS).concat(strategiesCol);

    $scope.tableRows = strategiesData;

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      strategiesCol.map = 'SS' + $scope.currentYear;
    });
  }
);
