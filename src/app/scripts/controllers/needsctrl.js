'use strict';

angular.module('iswpApp')
  .controller('NeedsCtrl',
    function ($scope, $rootScope, $http, $location, localStorageService,
      RegionService, EntityService, NeedsService, ISWP_VARS) {

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


      $scope.$on('$stateChangeSuccess', function() {
        var currentState = $scope.$state.current.name,
          stateParams = $scope.$stateParams;

        $scope.showRegions = false;

        //turn on regions layer if in summary state
        if (currentState === 'needs.summary') {
          $scope.showRegions = true;
        }

        if (currentState === 'needs.region') {
          //Set view to Region bounds
          //TODO: Since some of the region entities fall outside
          // the region's bounds, we might want to extend the bounds
          // of the region with the bounds of all the entities.
          var regionFeat = RegionService.getRegion(stateParams.region);
          $rootScope.$emit('map:zoomto:bounds', regionFeat.getBounds());
          
          //TODO: And show the entities in that region
          //TODO: Make sure values change when year changes
          var currNeeds = NeedsService.getCurrent();
          $scope.entities = EntityService.getEntities(
            _.pluck(currNeeds, 'EntityId'));
        }

        //TODO: For needs.county, will need county bounds
        // Could also just use bounds of all the entities in that
        // view, though this may not be ideal

      });




      return;
    }
  );
