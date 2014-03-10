'use strict';

angular.module('iswpApp')
  .controller('TableCtrl', function ($scope, CurrentDataService) {
    //TODO: Also need store of display names to field names
    $scope.currentData = CurrentDataService.data;
    return;
  });
