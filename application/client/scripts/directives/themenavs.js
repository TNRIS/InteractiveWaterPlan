'use strict';

angular.module('iswpApp')
  .directive('themeNavs', function ($state, $stateParams) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'templates/themenavs.html',
      link: function postLink(scope, element, attrs) {

        function updateNavLinks() {
          var splitState = $state.current.name.split('.');
          scope.parentState = _.first(splitState);
          var childStateName = _.last(splitState);

          scope.demandsRef = $state.href('demands.' + childStateName, $stateParams);
          scope.needsRef = $state.href('needs.' + childStateName, $stateParams);
          scope.strategiesRef = $state.href('strategies.' + childStateName, $stateParams);
        }

        updateNavLinks();

        scope.$on('$stateChangeSuccess', updateNavLinks);
      }
    };
  });
