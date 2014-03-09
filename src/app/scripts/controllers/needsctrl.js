'use strict';

angular.module('iswpApp')
  .controller('NeedsCtrl',
    function ($scope, $http, $routeParams, $location,
      RegionService, NeedsService, ISWP_VARS) {

        //Validate routeParams, redirect when invalid
        var validAreas = ['state']
          .concat(ISWP_VARS.regions)
          .concat(ISWP_VARS.counties);

        if (!_.contains(validAreas, $routeParams.area)) {
          $location.path('/');
        }

        if (!_.contains(ISWP_VARS.years, $routeParams.year)) {
          $location.path('/');
        }

        //TODO: validate $routeParams.subtheme


        $scope.showRegions = false;

        NeedsService.fetch();

        console.log("NeedsCtrl $routeParams", $routeParams);

        if ($routeParams.area === 'state') {
          $scope.showRegions = true;
        }

        return;
      }
  );
