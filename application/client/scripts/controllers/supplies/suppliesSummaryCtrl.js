'use strict';

angular.module('iswpApp').controller('SuppliesSummaryCtrl',
  function ($scope, suppliesData, TreeMapFactory, Utils, HeadingService, SUMMARY_TABLE_COLS, ISWP_VARS, API_PATH) {

    HeadingService.current =  'Regional Summary of Existing Water Supplies';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes projected existing water supplies by region and water use category in acre-feet/year (click on region for summary).';

    $scope.downloadPath = API_PATH + 'supplies/summary?format=csv';

    $scope.tableColumns = SUMMARY_TABLE_COLS;

    $scope.tableConfig = {
      isPaginationEnabled: false,
      showTotals: true
    };

    //Refresh data when the year changes
    $scope.$on('$stateChangeSuccess', function () {
      var dataForYear = _.where(suppliesData, {DECADE: $scope.currentYear});

      $scope.tableConfig.totals = Utils.calculateSummaryTotals(dataForYear);

      $scope.tableRows = dataForYear;
      $scope.treeMapConfig = TreeMapFactory.regionSummaryTreeMap(dataForYear);
      $scope.categoryTreeMapConfig = TreeMapFactory.categorySummaryTreeMap(dataForYear);
    });
  });
