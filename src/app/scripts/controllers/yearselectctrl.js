'use strict';

angular.module('iswpApp')
  .controller('YearSelectCtrl', function ($scope) {
    $scope.years = ['2010', '2020', '2030', '2040', '2050'];

    // $scope.selectedYear = $routeParams.year;

    // $scope.selectYear = function(year) {
    //   console.log("YearSelectCtrl select year", year);
    //   $changeRoute({year: year});
    // };
  });
