'use strict';

angular.module('iswpApp')
  .controller('YearSelectCtrl', function ($scope) {
    $scope.decades = ['2010', '2020', '2030', '2040', '2050'];

    $scope.selectedDecade = '2010';
  });
