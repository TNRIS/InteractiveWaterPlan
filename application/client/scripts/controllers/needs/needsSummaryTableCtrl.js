'use strict';

angular.module('iswpApp')
  .controller('NeedsSummaryTableCtrl', function ($scope, needsData) {

    $scope.heading = 'Regional Water Needs Summary';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes identified water needs by region and water use category in acre-feet/year (click on region for summary).';

    var cellTemplateUrl = 'partials/needs/needs_link_cell.html';

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

    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;

      //Get only the needsData for the currentYear
      var dataForYear = _.where(needsData, {DECADE:
        $scope.currentYear});

      $scope.tableRows = dataForYear;
    });
  });
