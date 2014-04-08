'use strict';

angular.module('iswpApp')
  .directive('themeNavs', function() {
    return {
      restrict: 'A',
      replace: true,
      template: '<div>' +
        '<div theme-nav="demands"></div>' +
        '<div theme-nav="needs"></div>' +
        '</div>'
    };
  })
  .directive('themeNav', function($state, $stateParams, ISWP_VARS) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: 'templates/themenav.html',
      link: function postLink(scope, element, attrs) {

        var thisTheme = attrs.themeNav.toLowerCase();

        var themeTitles = {
          'needs': 'Water Needs',
          'demands': 'Water Demands'
        };

        scope.themeTitle = themeTitles[thisTheme];

        scope.entityTypes = _.map(ISWP_VARS.entityTypes,
          function(entityType) {
            return {
              name: entityType.titleize(),
              type: entityType
            };
          }
        );

        scope.isActive = function() {
          return $state.includes(thisTheme);
        };

        scope.showSummary = function() {
          var currYear = $stateParams.year;

          $state.go(thisTheme + '.summary', {year: currYear});
          return;
        };

        scope.showEntityType = function(entityType) {
          var currYear = $stateParams.year;

          $state.go(thisTheme + '.type', {
            entityType: entityType.type,
            year: currYear
          });
        };

      }
    };
  });
