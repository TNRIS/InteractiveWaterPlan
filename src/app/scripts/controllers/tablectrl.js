'use strict';

angular.module('iswpApp')
  .controller('TableCtrl', function ($scope, needsData, ngTableParams) {
    //TODO: Also need store of display names to field names

    console.log("TABLE CTRL");
    //Get current data injected from states.js
    console.log("needsData in TableCtrl", needsData);

    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;

      var dataForYear = _.where(needsData, {DECADE:
        $scope.currentYear});

      $scope.tableRows = dataForYear;

      $scope.tableParams = new ngTableParams({
        sorting: {
          region: 'desc'
        }
      });

    });
    return;
  });
