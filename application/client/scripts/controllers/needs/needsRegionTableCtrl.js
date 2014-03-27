'use strict';

angular.module('iswpApp')
  .controller('NeedsRegionTableCtrl', function ($scope, $rootScope, needsData, localStorageService) {

    var region = $scope.$stateParams.region.toUpperCase();

    $scope.heading = 'Region '+region;
    $scope.mapDescription = 'Map displays entities and their identified water needs in <strong>Region '+region+'</strong> (water system service area boundaries may extend outside of region).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' identified water needs within <strong>Region '+region+'</strong> in {year}';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/year) in Region',
      cellClass: 'number',
      formatFunction: 'number'
    };

    var percentCol = {
      map: 'NPD2010',
      label: 'Overall Entity Need as % of Demand*',
      cellClass: 'percent',
      formatFunction: function(val) { return '' + val + '%'; }
    };

    var cellTemplateUrl = 'partials/needs/needs_link_cell.html';

    $scope.tableColumns = [
      {map: 'WugRegion', label: 'Region', cellClass: 'text-center'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugCounty', label: 'County', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugType', label: 'Entity Type', cellTemplateUrl: cellTemplateUrl},
      needsCol,
      percentCol
    ];

    var storedItemsPerPage = localStorageService.get('tableItemsPerPage');
    $scope.itemsPerPage = storedItemsPerPage || 20;

    $scope.tableConfig = {
      isGlobalSearchActivated: true,
      isPaginationEnabled: true,
      itemsByPage: $scope.itemsPerPage
    };

    $scope.tableRows = needsData;

    //TODO: Remember the sort order when changing Year

    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      needsCol.map = 'N' + $scope.currentYear;
      percentCol.map = 'NPD' + $scope.currentYear;
    });

    $scope.$watch('itemsPerPage', function() {
      if (!$scope.itemsPerPage) {
        return;
      }

      $scope.tableConfig.itemsByPage = $scope.itemsPerPage;
      localStorageService.set('tableItemsPerPage', $scope.itemsPerPage);
    });

    return;
  });
