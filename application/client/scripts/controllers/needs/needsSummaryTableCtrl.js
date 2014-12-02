'use strict';

angular.module('iswpApp').controller('NeedsSummaryTableCtrl',
  function ($scope, needsData, TreeMapFactory, SUMMARY_TABLE_COLS, ISWP_VARS, API_PATH) {

    $scope.heading = 'Regional Water Needs (Potential Shortage) Summary';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes identified water needs by region and water use category in acre-feet/year (click on region for summary).';

    $scope.downloadPath = API_PATH + 'needs/summary?format=csv';

    $scope.tableColumns = SUMMARY_TABLE_COLS;

    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    //Refresh data when the year changes
    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;

      //Get only the needsData for the currentYear
      var dataForYear = _.where(needsData, {DECADE:
        $scope.currentYear});

      $scope.tableRows = dataForYear;
      $scope.treeMapConfig = TreeMapFactory.regionSummaryTreeMap(dataForYear);
      $scope.categoryTreeMapConfig = TreeMapFactory.categorySummaryTreeMap(dataForYear);
    });
  });
