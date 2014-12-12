'use strict';

angular.module('iswpApp').controller('SuppliesSummaryCtrl',
  function ($scope, suppliesData, TreeMapFactory, HeadingService, SUMMARY_TABLE_COLS, ISWP_VARS, API_PATH) {

    HeadingService.current =  'Regional Summary of Existing Water Supplies';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes projected existing water supplies by region and water use category in acre-feet/year (click on region for summary).';

    $scope.downloadPath = API_PATH + 'supplies/summary?format=csv';

    $scope.tableColumns = SUMMARY_TABLE_COLS;

    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    //Refresh data when the year changes
    $scope.$on('$stateChangeSuccess', function () {
      $scope.currentYear = $scope.$stateParams.year;

      var dataForYear = _.where(suppliesData, {DECADE: $scope.currentYear});

      $scope.tableRows = dataForYear;
      $scope.treeMapConfig = TreeMapFactory.regionSummaryTreeMap(dataForYear);
      $scope.categoryTreeMapConfig = TreeMapFactory.categorySummaryTreeMap(dataForYear);
    });
  });
