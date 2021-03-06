'use strict';

angular.module('iswpApp').controller('DemandsSummaryCtrl',
  function ($scope, demandsData, TreeMapFactory, Utils, HeadingService, SUMMARY_TABLE_COLS, ISWP_VARS, API_PATH) {

    HeadingService.current =  'Regional Water Demand Summary';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes projected water demands by region and water use category in acre-feet/year (click on region for summary).';

    $scope.downloadPath = API_PATH + 'demands/summary?format=csv';

    $scope.tableColumns = SUMMARY_TABLE_COLS;

    $scope.tableConfig = {
      isPaginationEnabled: false,
      showTotals: true
    };

    //Refresh data when the year changes
    $scope.$on('$stateChangeSuccess', function() {
      //Get only the demandsData for the currentYear
      var dataForYear = _.where(demandsData, {DECADE: $scope.currentYear});

      $scope.tableConfig.totals = Utils.calculateSummaryTotals(dataForYear);

      $scope.tableRows = dataForYear;
      $scope.treeMapConfig = TreeMapFactory.regionSummaryTreeMap(dataForYear);
      $scope.categoryTreeMapConfig = TreeMapFactory.categorySummaryTreeMap(dataForYear);
    });
  });
