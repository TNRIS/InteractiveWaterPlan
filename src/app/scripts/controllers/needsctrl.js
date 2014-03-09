'use strict';

angular.module('iswpApp')
  .controller('NeedsCtrl',
    function ($scope, $http, $routeParams, $location, SearchParamService,
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
        $scope.zoom = 5;
        $scope.centerLat = 31.780548;
        $scope.centerLng = -99.022907;

        NeedsService.fetch();

        console.log("NeedsCtrl $routeParams", $routeParams);

        if ($routeParams.area === 'state') {
          $scope.showRegions = true;
        }

        var centerZoom = SearchParamService.getCenterZoomParams();     
        if (centerZoom) {
          $scope.zoom = centerZoom.zoom;
          $scope.centerLat = centerZoom.centerLat;
          $scope.centerLng = centerZoom.centerLng;
        }   

        return;
      }
  );
