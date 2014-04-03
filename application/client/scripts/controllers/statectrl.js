'use strict';

angular.module('iswpApp')
  .controller('StateCtrl', function ($scope, $state, $stateParams) {


    $scope.$on('$stateChangeSuccess', function() {
      $scope.parentState = _.first($state.current.name.split('.'));
    });

    $scope.isState = function(name) {
      return $scope.parentState === name;
    };

    return;
  });
