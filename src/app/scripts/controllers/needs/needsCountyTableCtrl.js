'use strict';

angular.module('iswpApp')
  .controller('NeedsCountyTableCtrl', function ($scope, needsData) {

    var county = $scope.$stateParams.county.titleize();

    $scope.heading = '' + county + ' County';
    $scope.mapDescription = 'Map shows geographic center of entities with identified water needs<span class="note-marker">*</span> within <strong>'+county+' County</strong> (water system service area boundaries may extend outside of county).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' identified water needs within <strong>'+county+' County</strong> in {year}';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/yr) in County',
      formatFunction: 'number'
    };

    var percentCol = {
      map: 'NPD2010',
      label: 'Entity Need as % of Demand**'
    };

    $scope.tableColumns = [
      {map: 'WugCounty', label: 'County'}, //TODO: link
      {map: 'EntityName', label: 'Name'}, //TODO: link
      {map: 'WugType', label: 'Entity Type'}, //TODO: link
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