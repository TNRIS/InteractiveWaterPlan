'use strict';

angular.module('iswpApp')
  .controller('NeedsRegionTableCtrl', function ($scope, $rootScope, needsData) {

    var region = $scope.$stateParams.region.toUpperCase();

    $scope.heading = 'Region '+region;
    $scope.mapDescription = 'Map shows geographic center of entities with identified water needs<span class="note-marker">*</span> in <strong>Region '+region+'</strong> (water system service area boundaries may extend outside of region).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' identified water needs within <strong>Region '+region+'</strong> in {year}';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/yr) in Region',
      formatFunction: 'number'
    };

    $scope.tableColumns = [
      {map: 'WugRegion', label: 'Region'},
      {map: 'EntityName', label: 'Name'}, //TODO: link
      {map: 'WugCounty', label: 'County'}, //TODO: link
      {map: 'WugType', label: 'Entity Type'}, //TODO: link
      {id: 'needsColumn', map: 'N2010', label: 'Need (acre-feet/yr) in Region', formatFunction: 'number'}
      //TODO: Get % Needs into API return {map: '', label: 'Entity Need As % of Demand'}, //TODO: % formatFunction
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

      needsCol.map = 'N'+$scope.currentYear;
    });
    return;
  });
