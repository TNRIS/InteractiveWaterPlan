'use strict';

angular.module('iswpApp')
  .controller('MapCtrl', function ($scope, $state, $stateParams, STATE_MAP_CONFIG) {

    $scope.isMapLocked = false;
    $scope.isMapHidden = false;

    $scope.mapConfig = {
      centerLat: STATE_MAP_CONFIG.centerLat,
      centerLng: STATE_MAP_CONFIG.centerLng,
      zoom: STATE_MAP_CONFIG.zoom
    };

    return;
  });
