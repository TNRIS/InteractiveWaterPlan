'use strict';

angular.module('iswpApp').controller('SuppliesCountyCtrl',
  function ($scope, $rootScope, suppliesData, HeadingService, COUNTY_TABLE_COLS, API_PATH) {

    var county = $scope.$stateParams.county.titleize();

    HeadingService.current =  county + ' County';
    $scope.mapDescription = 'Map displays water user groups within <strong>' + county + ' County</strong> and the relative volumes of their projected existing water supplies and associated sources of water (water system service area boundaries may extend outside of county).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' existing water supply within <strong>' + county + ' County</strong> in {year}';

    $scope.downloadPath = API_PATH + 'supplies/county/' + county + '?format=csv';

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

    $scope.tableColumns = COUNTY_TABLE_COLS.concat([sourceCol, suppliesCol]);

    $scope.tableRows = suppliesData;

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      suppliesCol.map = 'WS' + $scope.currentYear;
    });
  }
);
