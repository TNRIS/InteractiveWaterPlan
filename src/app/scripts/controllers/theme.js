'use strict';

angular.module('iswpApp')
  .controller('ThemeCtrl', function ($scope) {

    $scope.needsThemes = [
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
        name: 'Steam Electric'
      },
      {
        name: 'Livestock'
      },
      {
        name: 'Irrigation'
      }
    ];
  });
