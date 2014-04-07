'use strict';

angular.module('iswpApp')
  .directive('yearSelect', function($state, $stateParams, ISWP_VARS) {
    return {
      restrict: 'A',
      replace: true,
      template: '' +
        '<div>' +
          '<span class="decade-label">DECADE:</span>' +
          '<ul class="year-nav nav nav-pills">' +
            '<li ng-repeat="year in years" ng-class="{\'active\': year == selectedYear}">' +
              '<a href="" ng-click="selectYear(year)">{{year}}</a>' +
            '</li>' +
          '</li>' +
        '</div>',
      link: function postLink(scope, element, attrs) {
        scope.years = ISWP_VARS.years;

        scope.$on('$stateChangeSuccess', function() {
          scope.selectedYear = scope.$stateParams.year;
        });

        scope.selectYear = function(year) {
          var params = _.defaults({year: year}, $stateParams);
          $state.go($state.current.name, params);
        };
      }
    };
  });
