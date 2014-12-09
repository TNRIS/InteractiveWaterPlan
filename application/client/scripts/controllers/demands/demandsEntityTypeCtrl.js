'use strict';

angular.module('iswpApp')
  .controller('DemandsEntityTypeCtrl', function ($scope, $rootScope, demandsData, TreeMapFactory, TYPE_TABLE_COLS, ISWP_VARS, API_PATH) {

    var entityType = $scope.$stateParams.entityType.titleize();
    $scope.entityType = entityType;

    $scope.heading = entityType;
    $scope.mapDescription = 'Map displays <strong>' + entityType + '</strong> water user groups and their projected water demands.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists <strong>' + entityType + '</strong> water user groups and projected water demands in {year}';

    $scope.downloadPath = API_PATH + 'demands/type/' + entityType + '?format=csv';

    var demandsCol = {
      map: 'D2010',
      label: 'Demand (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = TYPE_TABLE_COLS.concat(demandsCol);

    $scope.tableRows = demandsData;

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      demandsCol.map = 'D' + $scope.currentYear;

      $scope.treeMapConfig = TreeMapFactory.entityTypeTreeMap(
        entityType, demandsData, 'D' + $scope.currentYear);
    });
  });
