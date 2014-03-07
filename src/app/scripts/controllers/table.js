'use strict';

angular.module('iswpApp')
  .controller('TableCtrl', function ($scope, $http) {
    $http.get('/api/v1/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  });