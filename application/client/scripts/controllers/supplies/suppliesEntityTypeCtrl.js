'use strict';

angular.module('iswpApp').controller('SuppliesEntityTypeCtrl',
  function ($scope, TreeMapFactory, suppliesData, HeadingService, TYPE_TABLE_COLS, ISWP_VARS, API_PATH) {

    var entityType = $scope.$stateParams.entityType.titleize();
    $scope.entityType = entityType;

    HeadingService.current =  entityType;
    $scope.mapDescription = 'Map displays the projected existing water supplies of <strong>' + entityType + '</strong> water user groups. <strong>Click</strong> on dot to view sources of water for that entity.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists <strong>' + entityType + '</strong> water user groups and existing water supplies in {year}';

    $scope.downloadPath = API_PATH + 'supplies/type/' + entityType + '?format=csv';

    var suppliesCol = {
      map: 'WS2010',
      label: 'Existing Water Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = TYPE_TABLE_COLS.concat(suppliesCol);

    $scope.tableRows = suppliesData;


    $scope.$on('$stateChangeSuccess', function () {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      suppliesCol.map = 'WS' + $scope.currentYear;

      $scope.treeMapConfig = TreeMapFactory.entityTypeTreeMap(
        entityType, suppliesData, 'WS' + $scope.currentYear);
    });
  });
