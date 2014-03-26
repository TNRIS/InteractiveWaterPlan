'use strict';

angular.module('iswpApp')
  .directive('itemsPerPage', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        'itemsPerPage': '='
      },
      template: '<div class="num-items">Items per page: ' +
          '<a href="" ng-class="{\'active\': itemsPerPage == 20}" ng-click="itemsPerPage=20">20</a> | ' +
          '<a href="" ng-class="{\'active\': itemsPerPage == 50}" ng-click="itemsPerPage=50">50</a> | ' +
          '<a href="" ng-class="{\'active\': itemsPerPage == 100}" ng-click="itemsPerPage=100">100</a> | ' +
          '<a href="" ng-class="{\'active\': itemsPerPage == 10000}" ng-click="itemsPerPage=10000">All</a>' +
          '</div>',
      link: function postLink(scope, element, attrs) {
        //TODO: could take a list of options and use ng-repeat to generate links

        if (!scope.itemsPerPage) {
          scope.itemsPerPage = 20;
        }
      }
    };
  });
