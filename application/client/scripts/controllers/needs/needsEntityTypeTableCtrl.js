'use strict';

angular.module('iswpApp')
  .controller('NeedsEntityTypeTableCtrl', function ($scope, needsData) {

    var entityType = $scope.$stateParams.entityType.titleize();

    $scope.heading = '' + entityType;
    $scope.mapDescription = 'Map shows geographic center of <strong>' + entityType + '</strong> entities with identified water needs<span class="note-marker">*</span>.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists <strong>' + entityType + '</strong> entities with identified water needs in {year}';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/yr)',
      formatFunction: 'number'
    };

    var percentCol = {
      map: 'NPD2010',
      label: 'Entity Need as % of Demand**'
    };

    $scope.tableColumns = [
      {map: 'WugType', label: 'Entity Type'}, //TODO: link
      {map: 'EntityName', label: 'Name'}, //TODO: link
      {map: 'WugCounty', label: 'County'}, //TODO: link
      needsCol,
      percentCol
    ];

    $scope.tableConfig = {
      isPaginationEnabled: true,
      itemsByPage: 20 //TODO: Make user-changeable
    };

    $scope.tableRows = needsData;

    //TODO: Remember the sort order when changing Year

    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      needsCol.map = 'N' + $scope.currentYear;
      percentCol.map = 'NPD' + $scope.currentYear;
    });
    return;
  });
