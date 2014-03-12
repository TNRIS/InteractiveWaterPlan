'use strict';

angular.module('iswpApp')
  .controller('YearSelectCtrl', function ($scope, ISWP_VARS) {
    $scope.years = ISWP_VARS.years;

    $scope.$on('$stateChangeSuccess', function() {
      $scope.selectedYear = $scope.$stateParams.year;
    });

    $scope.selectYear = function(year) {
      var params = _.defaults({year:year},
        $scope.$stateParams);

      $scope.$state.go($scope.$state.current.name,
        params);
    };
  });
