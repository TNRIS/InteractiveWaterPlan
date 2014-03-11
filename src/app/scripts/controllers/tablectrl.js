'use strict';

angular.module('iswpApp')
  .controller('TableCtrl', function ($scope, CurrentDataService) {
    //TODO: Also need store of display names to field names
    $scope.currentData = CurrentDataService.data;
    console.log("TABLE CTRL");

    $scope.viewTitle = 'Needs for {area} - {year}'.assign({
      area: $scope.$stateParams.area,
      year: $scope.$stateParams.year
    });

    return;
  });
