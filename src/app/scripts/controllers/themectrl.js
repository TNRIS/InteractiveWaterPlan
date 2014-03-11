'use strict';

angular.module('iswpApp')
  .controller('ThemeCtrl', function ($scope, $location, $routeParams) {

    $scope.needsThemes = [
      {
        name: 'View All'
      },
      {
        type: "divider"
      },
      {
        name: 'Municipal'
      },
      {
        name: 'Manufacturing'
      },
      {
        name: 'Mining'
      },
      {
        name: 'Steam-Electric'
      },
      {
        name: 'Livestock'
      },
      {
        name: 'Irrigation'
      }
    ];

    $scope.showTheme = function(theme) {
      console.log("Show Type", theme);
    };
  });
