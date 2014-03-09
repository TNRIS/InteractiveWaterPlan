'use strict';

angular.module('iswpApp')
  .controller('NeedsCtrl',
    function ($scope, $http, $routeParams,
      RegionService, NeedsService) {

        //TODO: Somehow validate routeParams

        $scope.showRegions = false;

        NeedsService.fetch();

        console.log("NeedsCtrl $routeParams", $routeParams);

        return;
      }
  );
