'use strict';

angular.module('iswpApp')
  .directive('themeNavs', function ($state, $stateParams) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'templates/themenavs.html',
      link: function postLink(scope, element, attrs) {

        function stateRefOrDefault(parent, child) {
          var sref = $state.href(parent + '.' + child, $stateParams);
          if (sref) {
            return sref;
          }

          return $state.href(parent + '.summary', {year: $stateParams.year});
        }

        function updateNavLinks() {
          var splitState = $state.current.name.split('.');
          scope.parentState = _.first(splitState);
          var childStateName = _.last(splitState);

          scope.demandsRef = stateRefOrDefault('demands', childStateName);
          scope.needsRef = stateRefOrDefault('needs', childStateName);
          scope.strategiesRef = stateRefOrDefault('strategies', childStateName);
          // TODO: scope.suppliesRef
        }

        updateNavLinks();

        scope.$on('$stateChangeSuccess', updateNavLinks);
      }
    };
  });
