'use strict';

angular.module('iswpApp')
  .controller('NeedsCtrl',
    function ($scope, $http, $routeParams, $location, SearchParamService,
      RegionService, NeedsService, YearService, ISWP_VARS) {

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

        YearService.setCurrentYear($routeParams.year);

        //Setup defaults
        $scope.showRegions = false;
        $scope.zoom = 5;
        $scope.centerLat = 31.780548;
        $scope.centerLng = -99.022907;
        $scope.viewTitle = 'Needs for ' + YearService.getCurrentYear();

        //Get all the needs data
        NeedsService.fetch();

        console.log("NeedsCtrl $routeParams", $routeParams);

        //Turn on regions if in the statewide view
        if ($routeParams.area === 'state') {
          $scope.showRegions = true;
        }

        //Try to get map center and zoom from search params
        var centerZoom = SearchParamService.getCenterZoomParams();     
        if (centerZoom) {
          $scope.zoom = centerZoom.zoom;
          $scope.centerLat = centerZoom.centerLat;
          $scope.centerLng = centerZoom.centerLng;
        }   

        $scope.$watch(YearService.getCurrentYear, function() {
          console.log("YEAR CHANGED", YearService.getCurrentYear());
          $scope.viewTitle = 'Needs for ' + YearService.getCurrentYear();
        });

        return;
      }
  );
