'use strict';

angular.module('iswpApp')
  .controller('ThemeCtrl', function ($scope, ISWP_VARS) {
    $scope.needsThemes = [
      {
        name: 'Regional Summary',
        type: 'ALL'
      },
      {
        type: "divider"
      }
    ];

    _.each(ISWP_VARS.entityTypes, function(entityType) {
      $scope.needsThemes.push({
        name: entityType.titleize(),
        type: entityType
      });
    });

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
