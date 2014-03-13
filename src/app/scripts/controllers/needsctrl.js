'use strict';

angular.module('iswpApp')
  .controller('NeedsCtrl',
    function ($scope, $http, $location, localStorageService,
      RegionService, NeedsService, ISWP_VARS) {

        console.log("NEEDS CTRL");

        //TODO: route validation (maybe this should be done in states.js?)
        // var validateRouteParams = function(evt, toState, toParams, fromState, fromParams) {
        //   console.log("validateRouteParams")

        //   var validAreas = ['state']
        //     .concat(ISWP_VARS.regions)
        //     .concat(ISWP_VARS.counties);

        //   // if (!_.contains(validAreas, $routeParams.area)) {
        //   //   evt.preventDefault();
        //   // }

        //   if (!_.contains(ISWP_VARS.years, toParams.year)) {
        //     evt.preventDefault();
        //   }
        //   //TODO: validate $routeParams.subtheme
        // };

        // //Validate routeParams, redirect when invalid
        // $scope.$on('$stateChangeStart', validateRouteParams);

        //Setup defaults
        $scope.showRegions = false;
        $scope.zoom = 5;
        $scope.centerLat = 31.780548;
        $scope.centerLng = -99.022907;

        //Get all the needs data
        // NeedsService.fetch()
        //   .then(function() {
        //     //and set it into the CurrentDataService
        //     angular.copy(NeedsService.needs, CurrentDataService.data);
        //   });

        //Turn on regions if in the statewide view
        //TODO: also watch for $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function() {
          $scope.showRegions = ($scope.$state.current.name === 'needs.summary');
        });


        //Get location from localStorage
        var mapLoc = localStorageService.get('mapLocation');
        if (mapLoc) {
          $scope.zoom = mapLoc.zoom;
          $scope.centerLat = mapLoc.centerLat;
          $scope.centerLng = mapLoc.centerLng;
        }

        return;
      }
  );
