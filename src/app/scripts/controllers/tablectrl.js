'use strict';

angular.module('iswpApp')
  .controller('TableCtrl', function ($scope, CurrentDataService) {

    $scope.currentData = CurrentDataService.data;
    return;
  });
