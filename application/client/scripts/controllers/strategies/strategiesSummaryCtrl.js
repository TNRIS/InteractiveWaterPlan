'use strict';

angular.module('iswpApp').controller('StrategiesSummaryCtrl',
  function ($scope, strategiesData, TreeMapFactory, HeadingService, SUMMARY_TABLE_COLS, ISWP_VARS, API_PATH) {

    HeadingService.current =  'Regional Summary of Recommended Water Management Supply Strategies';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes recommended strategy supplies by region and water use category in acre-feet/year (click on region for summary).';

    $scope.downloadPath = API_PATH + 'strategies/summary?format=csv';

    $scope.tableColumns = SUMMARY_TABLE_COLS;

    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    //Refresh data when the year changes
    $scope.$on('$stateChangeSuccess', function () {
      $scope.currentYear = $scope.$stateParams.year;

      var dataForYear = _.where(strategiesData, {DECADE: $scope.currentYear});

      $scope.tableRows = dataForYear;
      $scope.treeMapConfig = TreeMapFactory.regionSummaryTreeMap(dataForYear);
      $scope.categoryTreeMapConfig = TreeMapFactory.categorySummaryTreeMap(dataForYear);
    });
  });
