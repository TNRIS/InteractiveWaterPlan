'use strict';

angular.module('iswpApp')
  .controller('DemandsCountyCtrl', function ($scope, $rootScope, demandsData, HeadingService, COUNTY_TABLE_COLS, API_PATH) {

    var county = $scope.$stateParams.county.titleize();

    HeadingService.current = county + ' County';
    $scope.mapDescription = 'Map displays entities and their projected water demands within <strong>'+county+' County</strong> (water system service area boundaries may extend outside of county).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' projected water demands within <strong>'+county+' County</strong> in {year}';

    $scope.downloadPath = API_PATH + 'demands/county/' + county + '?format=csv';

    var demandsCol = {
      map: 'D2010',
      label: 'Demand (acre-feet/year) in County',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = COUNTY_TABLE_COLS.concat(demandsCol);

    $scope.tableRows = demandsData;

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      demandsCol.map = 'D' + $scope.currentYear;
    });
  });
