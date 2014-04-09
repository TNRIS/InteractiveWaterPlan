'use strict';

angular.module('iswpApp')
  .directive('themeNavs', function($state, $stateParams) {
    return {
      restrict: 'A',
      replace: true,
      template: '<div>' +
        '<ul class="nav nav-pills theme-nav">' +
          '<li ng-class="{active: parentState == \'demands\'}">' +
            '<a ng-href="{{demandsRef}}" title="Demands">Demands</a>' +
          '</li>' +
          '<li ng-class="{active: parentState == \'needs\'}">' +
            '<a ng-href="{{needsRef}}" title="Needs">Needs</a>' +
            '</li>' +
        '</ul>' +
        '</div>',
      link: function postLink(scope, element, attrs) {

        scope.$on('$stateChangeSuccess', function() {

          var splitState = $state.current.name.split('.');
          scope.parentState = _.first(splitState);
          var childStateName = _.last(splitState);

          scope.demandsRef = $state.href('demands.' + childStateName, $stateParams);
          scope.needsRef = $state.href('needs.' + childStateName, $stateParams);
        });


      }
    };
  });
