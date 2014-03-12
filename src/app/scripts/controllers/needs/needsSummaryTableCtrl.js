'use strict';

angular.module('iswpApp')
  .controller('NeedsSummaryTableCtrl', function ($scope, needsData) {

    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;

      //TODO: This is only valid for summary table. generalize or make different controllers.
      var dataForYear = _.where(needsData, {DECADE:
        $scope.currentYear});

      $scope.tableRows = dataForYear;

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
      //--end TODO

    });
    return;
  });
