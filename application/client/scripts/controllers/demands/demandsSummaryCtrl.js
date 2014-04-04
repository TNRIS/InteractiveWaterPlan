'use strict';

angular.module('iswpApp')
  .controller('DemandsSummaryCtrl', function ($scope, demandsData, ISWP_VARS, API_PATH) {

    $scope.heading = 'Regional Water Demand Summary';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes projected water demands by region and water use category in acre-feet/year (click on region for summary).';

    $scope.downloadPath = API_PATH + 'demands/summary?format=csv';

    var cellTemplateUrl = 'partials/linkcell.html';

    $scope.tableColumns = [
      {map: 'WugRegion', label: 'Region', cellTemplateUrl: cellTemplateUrl, headerClass: 'text-center', cellClass: 'text-center'},
      {map: 'MUNICIPAL', label: 'Municipal', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'MANUFACTURING', label: 'Manufacturing', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'MINING', label: 'Mining', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'STEAMELECTRIC', label: 'Steam-Electric', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'LIVESTOCK', label: 'Livestock', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'IRRIGATION', label: 'Irrigation', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'TOTAL', label: 'Total', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
    ];

    $scope.tableConfig = {
      isPaginationEnabled: false
    };


    //TODO: Remember the sort order when changing Year
    //Refresh stuff when the year changes
    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;

      //Get only the needsData for the currentYear
      var dataForYear = _.where(demandsData, {DECADE:
        $scope.currentYear});

      $scope.tableRows = dataForYear;
      // $scope.treeMapConfig = createRegionTreeMap(dataForYear);
      // $scope.categoryTreeMapConfig = createCategoryTreeMap(dataForYear);
    });

    return;
  });
