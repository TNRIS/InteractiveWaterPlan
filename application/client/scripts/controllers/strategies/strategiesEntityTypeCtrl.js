'use strict';

angular.module('iswpApp').controller('StrategiesEntityTypeCtrl',
  function ($scope, TreeMapFactory, strategiesData, HeadingService, TYPE_TABLE_COLS, ISWP_VARS, API_PATH) {

    var entityType = $scope.$stateParams.entityType.titleize();
    $scope.entityType = entityType;

    HeadingService.current =  entityType;
    $scope.mapDescription = 'Map displays <strong>' + entityType + '</strong> water user groups with recommended water management strategy supplies. <strong>Click</strong> on dot to view sources of water for that entity.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists <strong>' + entityType + '</strong> water user groups and recommended water management strategy supplies in {year}';

    $scope.downloadPath = API_PATH + 'strategies/type/' + entityType + '?format=csv';

    var strategiesCol = {
      map: 'SSS2010',
      label: 'Recommended Strategy Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = TYPE_TABLE_COLS.concat(strategiesCol);

    $scope.tableRows = strategiesData;


    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      strategiesCol.map = 'SS' + $scope.currentYear;

      //TODO: createTreeMap (put in treemapservice, use also in demands and needs type views)
      $scope.treeMapConfig = TreeMapFactory.entityTypeTreeMap(
        entityType, strategiesData, 'SS' + $scope.currentYear);
    });
  });
