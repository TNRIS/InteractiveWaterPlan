'use strict';

angular.module('iswpApp').controller('StrategiesCountyCtrl',
  function ($scope, $rootScope, strategiesData, COUNTY_TABLE_COLS, API_PATH) {

    var county = $scope.$stateParams.county.titleize();

    $scope.heading = county + ' County';
    $scope.mapDescription = 'Map displays entities with recommended water management strategy supplies within <strong>' + county + ' County</strong> (water system service area boundaries may extend outside of county).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' recommended strategy supply within <strong>' + county + ' County</strong> in {year}';

    $scope.downloadPath = API_PATH + 'strategies/county/' + county + '?format=csv';

    var sourceCol = {
      map: 'SourceName',
      label: 'Source',
      headerClass: 'text-center'
    };

    var strategiesCol = {
      map: 'SS2010',
      label: 'Recommended Strategy Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = COUNTY_TABLE_COLS.concat([sourceCol, strategiesCol]);

    $scope.tableRows = strategiesData;

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      strategiesCol.map = 'SS' + $scope.currentYear;
    });
  }
);
