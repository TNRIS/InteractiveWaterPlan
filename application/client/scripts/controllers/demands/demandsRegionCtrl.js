'use strict';

angular.module('iswpApp')
  .controller('DemandsRegionCtrl', function ($scope, $rootScope, demandsData, localStorageService, API_PATH) {

    var region = $scope.$stateParams.region.toUpperCase();

    $scope.heading = 'Region ' + region;
    $scope.mapDescription = 'Map displays entities and their projected water demands in <strong>Region '+region+'</strong> (water system service area boundaries may extend outside of region).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' projected water demands within <strong>Region '+region+'</strong> in {year}';

    $scope.downloadPath = API_PATH + 'demands/region/' + region + '?format=csv';

    var demandsCol = {
      map: 'D2010',
      label: 'Demand (acre-feet/year) in Region',
      cellClass: 'number',
      formatFunction: 'number'
    };

    var cellTemplateUrl = 'templates/linkcell.html';

    $scope.tableColumns = [
      {map: 'WugRegion', label: 'Region', cellClass: 'text-center'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugCounty', label: 'County', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugType', label: 'Entity Type', cellTemplateUrl: cellTemplateUrl},
      demandsCol
    ];

    var storedItemsPerPage = localStorageService.get('tableItemsPerPage');
    $scope.itemsPerPage = storedItemsPerPage || 20;

    $scope.tableConfig = {
      selectionMode: 'single',
      isGlobalSearchActivated: true,
      isPaginationEnabled: true,
      itemsByPage: $scope.itemsPerPage
    };

    $scope.tableRows = demandsData;

    //TODO: Remember the sort order when changing Year

    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      demandsCol.map = 'D' + $scope.currentYear;
    });

    $scope.$watch('itemsPerPage', function() {
      if (!$scope.itemsPerPage) {
        return;
      }

      $scope.tableConfig.itemsByPage = $scope.itemsPerPage;
      localStorageService.set('tableItemsPerPage', $scope.itemsPerPage);
    });

    //Watch for selectionChange events from the Smart-Table
    // and emit a rootScope event to toggle the feature
    // highlight
    $scope.$on('selectionChange', function(event, args) {
      $rootScope.$emit('map:togglehighlight', args.item);
      return;
    });

    return;
  });
