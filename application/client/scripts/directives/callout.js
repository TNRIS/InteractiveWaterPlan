'use strict';

angular.module('iswpApp')
  .directive('callout', function () {
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      scope: {
        'closeable': '='
      },
      template: '<div class="callout" ng-show="!isClosed">' +
        '<button ng-show="closeable" type="button" class="close" ' +
          'aria-hidden="true" data-dismiss="callout" ng-click="isClosed=true">' +
            '&times;</button>' +
        '<div ng-transclude></div>' +
        '</div>'
    };
  });
