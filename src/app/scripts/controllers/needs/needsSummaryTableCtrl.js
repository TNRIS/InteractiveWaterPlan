'use strict';

angular.module('iswpApp')
  .controller('NeedsSummaryTableCtrl', function ($scope, needsData) {

    $scope.tableColumns = [
      {map: 'REGION', label: 'Region'},
      {map: 'MUNICIPAL', label: 'Municipal', formatFunction: 'number'},
      {map: 'MANUFACTURING', label: 'Manufacturing', formatFunction: 'number'},
      {map: 'MINING', label: 'Mining', formatFunction: 'number'},
      {map: 'STEAMELECTRIC', label: 'Steam-Electric', formatFunction: 'number'},
      {map: 'LIVESTOCK', label: 'Livestock', formatFunction: 'number'},
      {map: 'IRRIGATION', label: 'Irrigation', formatFunction: 'number'},
      {map: 'TOTAL', label: 'Total', formatFunction: 'number'},
    ];

    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;

      //Get only the needsData for the currentYear
      var dataForYear = _.where(needsData, {DECADE:
        $scope.currentYear});

      $scope.tableRows = dataForYear;
    });
    return;
  });
