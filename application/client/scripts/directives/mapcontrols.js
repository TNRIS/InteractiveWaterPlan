'use strict';

angular.module('iswpApp')
  .directive('mapControls', function($state, $stateParams, ISWP_VARS) {
    return {
      restrict: 'A',
      replace: false,
      // template: '',
      // <div ng-controller="MapControlsCtrl" class="col-md-6 ">
      //   <ul class="map-controls nav nav-pills pull-right">
      //     <li ng-class="{'active': isMapLocked}" ng-hide="isMapHidden">
      //       <a href="" ng-click="toggleMapLock()">
      //         <i class="fa" ng-class="{'fa-lock': isMapLocked, 'fa-unlock-alt': !isMapLocked}"></i>
      //         <span ng-show="isMapLocked">Unlock Map</span>
      //         <span ng-show="!isMapLocked">Lock Map</span>
      //       </a>
      //     </li>
      //     <li class="" ng-hide="isMapHidden">
      //       <a href="" ng-click="zoomToState()">Zoom to Texas</a>
      //     </li>
      //     <li class="">
      //       <a href="" ng-click="toggleMapHide()">
      //         <span ng-show="isMapHidden">Show Map</span>
      //         <span ng-show="!isMapHidden">Hide Map</span>
      //       </a>
      //     </li>
      //   </ul>
      // </div>

      // templateUrl: 'partials/themenav.html',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
