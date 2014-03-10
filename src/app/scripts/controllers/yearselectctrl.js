'use strict';

angular.module('iswpApp')
  .controller('YearSelectCtrl', function ($scope, YearService) {
    $scope.years = ['2010', '2020', '2030', '2040', '2050'];

    $scope.selectedYear = YearService.getCurrentYear();

    $scope.$watch(YearService.getCurrentYear, function() {
      console.log("YearSelect year changed", YearService.getCurrentYear()); 
      $scope.selectedYear = YearService.getCurrentYear();
    });

    $scope.selectYear = function(year) {
      console.log("selected year", year);
      YearService.setCurrentYear(year);
    };
  });
