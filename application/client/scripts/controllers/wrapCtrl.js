'use strict';

angular.module('iswpApp').controller('WrapCtrl',
  function ($scope, $rootScope, $state, $stateParams, HeadingService, TableSettingsService, DATA_VALUE_PREFIXES, TREE_MAP_SUBJECTS) {

    $scope.$watch(HeadingService.get, function (val) {
      $scope.heading = val;
    });

    $scope.itemsPerPage = TableSettingsService.getItemsPerPage();

    //tableConfig used by most data views
    //it can be overwritten in specific controllers
    $scope.tableConfig = {
      selectionMode: 'single',
      isGlobalSearchActivated: true,
      isPaginationEnabled: true,
      itemsByPage: $scope.itemsPerPage
    };

    $scope.$watch('itemsPerPage', function() {
      if (!$scope.itemsPerPage) {
        return;
      }

      $scope.tableConfig.itemsByPage = $scope.itemsPerPage;
      TableSettingsService.setItemsPerPage($scope.itemsPerPage);
    });

    $scope.hasValues = function (tableRows) {
      if (!tableRows.length) {
        return false;
      }

      var parentState = $state.current.name.split('.')[0];
      var valueKey = DATA_VALUE_PREFIXES[parentState] + $scope.currentYear;

      return _.some(tableRows, function (r) {
        return angular.isDefined(r[valueKey]);
      });
    };

    $scope.$on('$stateChangeSuccess', function () {
      var parentState = $state.current.name.split('.')[0];

      $scope.treeMapSubject = TREE_MAP_SUBJECTS[parentState];
      $scope.currentYear = $scope.$stateParams.year;
    });

    //Watch for selectionChange events from the Smart-Table
    // and emit a rootScope event to toggle the feature
    // highlight
    $scope.$on('selectionChange', function (event, args) {
      $rootScope.$emit('map:togglehighlight', args.item);
    });
});
