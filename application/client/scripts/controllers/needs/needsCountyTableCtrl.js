'use strict';

angular.module('iswpApp')
  .controller('NeedsCountyTableCtrl', function ($scope, $rootScope, needsData, HeadingService, COUNTY_TABLE_COLS, API_PATH) {

    var county = $scope.$stateParams.county.titleize();

    HeadingService.current =  county + ' County';
    $scope.mapDescription = 'Map displays entities and their identified water needs within <strong>'+county+' County</strong> (water system service area boundaries may extend outside of county).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' identified water needs within <strong>'+county+' County</strong> in {year}.';

    $scope.downloadPath = API_PATH + 'needs/county/' + county + '?format=csv';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/year) in County',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0
    };

    var percentCol = {
      map: 'NPD2010',
      label: 'Overall Entity Need as % of Demand*',
      cellClass: 'percent',
      headerClass: 'text-center',
      formatFunction: function(val) { return '' + val + '%'; }
    };

    $scope.tableColumns = COUNTY_TABLE_COLS.concat([needsCol, percentCol]);

    $scope.tableRows = needsData;

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      needsCol.map = 'N' + $scope.currentYear;
      percentCol.map = 'NPD' + $scope.currentYear;
    });
  });
