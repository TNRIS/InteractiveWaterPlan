'use strict';

angular.module('iswpApp').controller('WrapCtrl',
  function ($scope, $state, $stateParams, TableSettingsService, TREE_MAP_SUBJECTS) {

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

    $scope.$on('$stateChangeSuccess', function () {
      var parentState = $state.current.name.split('.')[0];
      $scope.treeMapSubject = TREE_MAP_SUBJECTS[parentState];

      $scope.currentYear = $scope.$stateParams.year;
      return;
    });
});