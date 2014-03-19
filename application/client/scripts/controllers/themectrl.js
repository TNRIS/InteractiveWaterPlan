'use strict';

angular.module('iswpApp')
  .controller('ThemeCtrl', function ($scope) {
    $scope.needsThemes = [
      {
        name: 'Regional Summary',
        type: 'ALL'
      },
      {
        type: "divider"
      },
      {
        name: 'Municipal',
        type: 'MUNICIPAL'
      },
      {
        name: 'Manufacturing',
        type: 'MANUFACTURING'
      },
      {
        name: 'Mining',
        type: 'MINING'
      },
      {
        name: 'Steam-Electric',
        type: 'STEAM-ELECTRIC'
      },
      {
        name: 'Livestock',
        type: 'LIVESTOCK'
      },
      {
        name: 'Irrigation',
        type: 'IRRIGATION'
      }
    ];

    $scope.showTheme = function(theme) {
      var currYear = $scope.$stateParams.year;
      //if the Regional Summary is selected, go to it
      if (theme.type === "ALL") {
        $scope.$state.go('needs.summary',
          {year: currYear});
        return;
      }

      //otherwise go to the Needs by EntityType view
      $scope.$state.go('needs.type', {
        entityType: theme.type,
        year: currYear
      });
    };
  });
