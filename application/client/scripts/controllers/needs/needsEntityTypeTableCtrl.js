'use strict';

angular.module('iswpApp')
  .controller('NeedsEntityTypeTableCtrl', function ($scope, $rootScope, needsData, HeadingService, TreeMapFactory, TYPE_TABLE_COLS, ISWP_VARS, API_PATH) {

    var entityType = $scope.$stateParams.entityType.titleize();
    $scope.entityType = entityType;

    HeadingService.current =  entityType;
    $scope.mapDescription = 'Map displays <strong>' + entityType + '</strong> water user groups and their identified water needs.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists <strong>' + entityType + '</strong> water user groups and identified water needs in {year}.';

    $scope.downloadPath = API_PATH + 'needs/type/' + entityType + '?format=csv';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0
    };

    var percentCol = {
      map: 'NPD2010',
      label: 'Overall Entity Need as % of Demand*',
      cellClass: 'percent',
      headerClass: 'text-center',
      formatFunction: function(val) { return '' + val + '%'; }
    };

    $scope.tableColumns = TYPE_TABLE_COLS.concat([needsCol, percentCol]);

    $scope.tableRows = needsData;

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      needsCol.map = 'N' + $scope.currentYear;
      percentCol.map = 'NPD' + $scope.currentYear;

      $scope.treeMapConfig = TreeMapFactory.entityTypeByRegion(
        entityType, needsData, 'N' + $scope.currentYear);
    });
  });
