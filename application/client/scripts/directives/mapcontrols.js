'use strict';

angular.module('iswpApp')
  .directive('mapControls', function($rootScope) {
    return {
      restrict: 'A',
      replace: true,
      template: '' +
        '<div>' +
          '<ul class="map-controls nav nav-pills pull-right">' +
            '<li ng-class="{\'active\': isMapLocked}" ng-hide="isMapHidden">' +
              '<a href="" ng-click="toggleMapLock()">' +
                '<i class="fa" ng-class="{\'fa-lock\': isMapLocked, \'fa-unlock-alt\': !isMapLocked}"></i>' +
                '<span ng-show="isMapLocked">Unlock Map</span>' +
                '<span ng-show="!isMapLocked">Lock Map</span>' +
              '</a>' +
            '</li>' +
            '<li class="" ng-hide="isMapHidden">' +
              '<a href="" ng-click="zoomToState()">Zoom to Texas</a>' +
            '</li>' +
            '<li class="">' +
              '<a href="" ng-click="toggleMapHide()">' +
                '<span ng-show="isMapHidden">Show Map</span>' +
                '<span ng-show="!isMapHidden">Hide Map</span>' +
              '</a>' +
            '</li>' +
          '</ul>' +
        '</div>',
      link: function postLink(scope, element, attrs) {
        scope.isMapLocked = false;
        scope.isMapHidden = false;

        scope.toggleMapLock = function() {
          scope.isMapLocked = !scope.isMapLocked;
          $rootScope.$emit('map:togglelock', scope.isMapLocked);
        };

        scope.zoomToState = function() {
          $rootScope.$emit('map:zoomto:state');
        };

        scope.toggleMapHide = function() {
          scope.isMapHidden = !scope.isMapHidden;
          $rootScope.$emit('map:togglehide', scope.isMapHidden);
        };

      }
    };
  });
