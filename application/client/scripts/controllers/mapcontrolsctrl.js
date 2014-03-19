'use strict';

angular.module('iswpApp')
  .controller('MapControlsCtrl', function ($scope, $rootScope) {

    $scope.isMapLocked = false;
    $scope.isMapHidden = false;

    $scope.toggleMapLock = function() {
      $scope.isMapLocked = !$scope.isMapLocked;
      $rootScope.$emit('map:togglelock', $scope.isMapLocked);
    };

    $scope.zoomToState = function() {
      $rootScope.$emit('map:zoomto:state');
    };

    $scope.toggleMapHide = function() {
      $scope.isMapHidden = !$scope.isMapHidden;
      $rootScope.$emit('map:togglehide', $scope.isMapHidden);
    };
  });
