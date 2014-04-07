'use strict';

angular.module('iswpApp')
  .directive('mapControls', function($rootScope) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        mapLocked: '=',
        mapHidden: '='
      },
      template: '' +
        '<div>' +
          '<ul class="map-controls nav nav-pills pull-right">' +
            '<li ng-class="{\'active\': mapLocked}" ng-hide="mapHidden">' +
              '<a href="" ng-click="toggleMapLock()">' +
                '<i class="fa" ng-class="{\'fa-lock\': mapLocked, \'fa-unlock-alt\': !mapLocked}"></i> ' +
                '<span ng-show="mapLocked">Unlock Map</span>' +
                '<span ng-show="!mapLocked">Lock Map</span>' +
              '</a>' +
            '</li>' +
            '<li class="" ng-hide="mapHidden">' +
              '<a href="" ng-click="zoomToState()">Zoom to Texas</a>' +
            '</li>' +
            '<li class="">' +
              '<a href="" ng-click="toggleMapHide()">' +
                '<span ng-show="mapHidden">Show Map</span>' +
                '<span ng-show="!mapHidden">Hide Map</span>' +
              '</a>' +
            '</li>' +
          '</ul>' +
        '</div>',
      link: function postLink(scope, element, attrs) {

        scope.toggleMapLock = function() {
          scope.mapLocked = !scope.mapLocked;
          $rootScope.$emit('map:togglelock', scope.mapLocked);
        };

        scope.zoomToState = function() {
          $rootScope.$emit('map:zoomto:state');
        };

        scope.toggleMapHide = function() {
          scope.mapHidden = !scope.mapHidden;
          $rootScope.$emit('map:togglehide', scope.mapHidden);
        };

      }
    };
  });
