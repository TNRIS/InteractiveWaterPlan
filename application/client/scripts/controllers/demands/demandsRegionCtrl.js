'use strict';

angular.module('iswpApp')
  .controller('DemandsRegionCtrl', function ($scope, $rootScope, demandsData, HeadingService, REGION_TABLE_COLS, API_PATH) {

    var region = $scope.$stateParams.region.toUpperCase();

    HeadingService.current =  'Region ' + region;
    $scope.mapDescription = 'Map displays entities and their projected water demands in <strong>Region '+region+'</strong> (water system service area boundaries may extend outside of region).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' projected water demands within <strong>Region '+region+'</strong> in {year}';

    $scope.downloadPath = API_PATH + 'demands/region/' + region + '?format=csv';

    var demandsCol = {
      map: 'D2010',
      label: 'Demand (acre-feet/year) in Region',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = REGION_TABLE_COLS.concat(demandsCol);

    $scope.tableRows = demandsData;

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});
      demandsCol.map = 'D' + $scope.currentYear;
    });
  });
